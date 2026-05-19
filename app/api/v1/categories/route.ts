import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import { Category, Product, Service } from "@/lib/db/models";
import { categorySchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/v1/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const withCounts = searchParams.get("withCounts") === "true";

    // Build query
    const query: Record<string, unknown> = { isActive: true };

    if (featured === "true") {
      query.isFeatured = true;
    }

    let categories: any[] = await Category.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    // Add product/service counts if requested
    if (withCounts) {
      categories = await Promise.all(
        categories.map(async (category) => {
          const [productCount, serviceCount] = await Promise.all([
            Product.countDocuments({
              category: category._id,
              status: "active",
            }),
            Service.countDocuments({
              category: category._id,
              status: "active",
            }),
          ]);

          return {
            ...category,
            productCount,
            serviceCount,
          };
        })
      );
    }

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/v1/categories - Create a new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Only admins can create categories" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate input
    const validatedData = categorySchema.parse(body);

    // Check if category with same name/slug exists
    const existingCategory = await Category.findOne({
      $or: [{ name: validatedData.name }, { slug: validatedData.slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // Get the highest order number
    const lastCategory = await Category.findOne().sort({ order: -1 });
    const order = lastCategory ? lastCategory.order + 1 : 1;

    // Create category
    const category = await Category.create({
      ...validatedData,
      order,
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
