import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import { Review, Product, Service, Order, EntrepreneurProfile, Notification } from "@/lib/db/models";
import { reviewSchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/v1/reviews - Get reviews with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filtering
    const productId = searchParams.get("product");
    const serviceId = searchParams.get("service");
    const entrepreneurId = searchParams.get("entrepreneur");
    const customerId = searchParams.get("customer");
    const status = searchParams.get("status") || "approved";

    // Build query
    const query: Record<string, unknown> = { status };

    if (productId) query.product = productId;
    if (serviceId) query.service = serviceId;
    if (entrepreneurId) query.entrepreneur = entrepreneurId;
    if (customerId) query.customer = customerId;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("customer", "firstName lastName avatar")
        .populate("product", "title slug images")
        .populate("service", "title slug images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ]);

    // Calculate rating distribution if filtering by product/service/entrepreneur
    let ratingDistribution = null;
    if (productId || serviceId || entrepreneurId) {
      const distributionQuery = { ...query };
      delete distributionQuery.status;
      distributionQuery.status = "approved";

      const distribution = await Review.aggregate([
        { $match: distributionQuery },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
      ]);

      ratingDistribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      distribution.forEach((d) => {
        ratingDistribution[d._id as keyof typeof ratingDistribution] = d.count;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        ratingDistribution,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/v1/reviews - Create a new review (Customer only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "customer") {
      return NextResponse.json(
        { success: false, error: "Only customers can leave reviews" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate input
    const validatedData = reviewSchema.parse(body);

    // Verify the customer has purchased the product/service
    if (validatedData.product) {
      const order = await Order.findOne({
        customer: session.user.id,
        "items.product": validatedData.product,
        status: "delivered",
      });

      if (!order) {
        return NextResponse.json(
          {
            success: false,
            error: "You can only review products you have purchased",
          },
          { status: 403 }
        );
      }

      // Check if already reviewed
      const existingReview = await Review.findOne({
        customer: session.user.id,
        product: validatedData.product,
      });

      if (existingReview) {
        return NextResponse.json(
          { success: false, error: "You have already reviewed this product" },
          { status: 400 }
        );
      }
    }

    // Get entrepreneur from product/service
    let entrepreneur;
    if (validatedData.product) {
      const product = await Product.findById(validatedData.product);
      entrepreneur = product?.entrepreneur;
    } else if (validatedData.service) {
      const service = await Service.findById(validatedData.service);
      entrepreneur = service?.entrepreneur;
    }

    // Create review
    const review = await Review.create({
      ...validatedData,
      customer: session.user.id,
      entrepreneur,
      status: "approved", // Auto-approve for now, can be changed to "pending" for moderation
    });

    // Update product/service rating
    if (validatedData.product) {
      const reviews = await Review.find({
        product: validatedData.product,
        status: "approved",
      });
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await Product.findByIdAndUpdate(validatedData.product, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      });
    } else if (validatedData.service) {
      const reviews = await Review.find({
        service: validatedData.service,
        status: "approved",
      });
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await Service.findByIdAndUpdate(validatedData.service, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      });
    }

    // Update entrepreneur rating
    if (entrepreneur) {
      const allReviews = await Review.find({
        entrepreneur,
        status: "approved",
      });
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      const entrepreneurProfile = await EntrepreneurProfile.findByIdAndUpdate(entrepreneur, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      });

      // Notify entrepreneur
      await Notification.create({
        recipient: entrepreneurProfile?.user,
        type: "review",
        title: "New Review Received",
        message: `You received a ${validatedData.rating}-star review`,
        link: validatedData.product
          ? `/entrepreneur/products/${validatedData.product}`
          : `/entrepreneur/services/${validatedData.service}`,
        relatedId: review._id,
        relatedModel: "Review",
      });
    }

    // Populate and return
    const populatedReview = await Review.findById(review._id)
      .populate("customer", "firstName lastName avatar")
      .populate("product", "title slug")
      .populate("service", "title slug");

    return NextResponse.json(
      { success: true, data: populatedReview },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    );
  }
}
