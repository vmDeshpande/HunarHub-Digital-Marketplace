import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import { Service, Category } from "@/lib/db/models";
import { serviceSchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/v1/services - Get all services with filtering, sorting, pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Filtering
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const entrepreneur = searchParams.get("entrepreneur");
    const status = searchParams.get("status") || "active";

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: Record<string, unknown> = { status };

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (entrepreneur) {
      query.entrepreneur = entrepreneur;
    }

    if (minPrice || maxPrice) {
      query["pricing.basePrice"] = {};
      if (minPrice)
        (query["pricing.basePrice"] as Record<string, number>).$gte =
          parseInt(minPrice);
      if (maxPrice)
        (query["pricing.basePrice"] as Record<string, number>).$lte =
          parseInt(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (featured === "true") {
      query.featured = true;
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const [services, total] = await Promise.all([
      Service.find(query)
        .populate("category", "name slug")
        .populate("skills", "name")
        .populate({
          path: "entrepreneur",
          select: "businessName rating reviewCount user location",
          populate: { path: "user", select: "firstName lastName avatar" },
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Service.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        services,
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
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/v1/services - Create a new service (Entrepreneur only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "entrepreneur") {
      return NextResponse.json(
        { success: false, error: "Only entrepreneurs can create services" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate input
    const validatedData = serviceSchema.parse(body);

    // Create service
    const service = await Service.create({
      ...validatedData,
      entrepreneur: session.user.entrepreneurId,
    });

    // Populate and return
    const populatedService = await Service.findById(service._id)
      .populate("category", "name slug")
      .populate("skills", "name")
      .populate({
        path: "entrepreneur",
        select: "businessName",
        populate: { path: "user", select: "firstName lastName" },
      });

    return NextResponse.json(
      { success: true, data: populatedService },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create service" },
      { status: 500 }
    );
  }
}
