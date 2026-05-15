import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import { Product, Review } from "@/lib/db/models";
import { productSchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/v1/products/[slug] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const product = await Product.findOne({ slug })
      .populate("category", "name slug description")
      .populate("skills", "name")
      .populate({
        path: "entrepreneur",
        select: "businessName bio tagline rating reviewCount completedOrders responseTime location socialLinks verified user",
        populate: { path: "user", select: "firstName lastName avatar" },
      })
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Get reviews for this product
    const reviews = await Review.find({
      product: product._id,
      status: "approved",
    })
      .populate("customer", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

    return NextResponse.json({
      success: true,
      data: { ...product, reviews },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/products/[slug] - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    const { slug } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check ownership or admin
    const isOwner =
      product.entrepreneur.toString() === session.user.entrepreneurId;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Not authorized to update this product" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = productSchema.partial().parse(body);

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      { $set: validatedData },
      { new: true }
    )
      .populate("category", "name slug")
      .populate({
        path: "entrepreneur",
        select: "businessName",
        populate: { path: "user", select: "firstName lastName" },
      });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/products/[slug] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    const { slug } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check ownership or admin
    const isOwner =
      product.entrepreneur.toString() === session.user.entrepreneurId;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Not authorized to delete this product" },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(product._id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
