import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongoose";
import { Order, Product, User, Notification } from "@/lib/db/models";
import { orderSchema } from "@/lib/validations";
import { z } from "zod";
import { generateOrderNumber } from "@/lib/utils/helpers";

// GET /api/v1/orders - Get orders for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filtering
    const status = searchParams.get("status");

    // Build query based on user role
    let query: Record<string, unknown> = {};

    if (session.user.role === "customer") {
      query.customer = session.user.id;
    } else if (session.user.role === "entrepreneur") {
      query.entrepreneur = session.user.entrepreneurId;
    }
    // Admins can see all orders

    if (status && status !== "all") {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("customer", "firstName lastName email avatar")
        .populate({
          path: "entrepreneur",
          select: "businessName user",
          populate: { path: "user", select: "firstName lastName avatar" },
        })
        .populate("items.product", "title images slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
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
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/v1/orders - Create a new order (Customer only)
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
        { success: false, error: "Only customers can place orders" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate input
    const validatedData = orderSchema.parse(body);

    // Verify products exist and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of validatedData.items) {
      const product = await Product.findById(item.product).populate(
        "entrepreneur"
      );

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.product} not found` },
          { status: 400 }
        );
      }

      if (product.inventory.quantity < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${product.title}`,
          },
          { status: 400 }
        );
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        variant: item.variant,
        customization: item.customization,
      });

      subtotal += product.price * item.quantity;

      // Update inventory
      await Product.findByIdAndUpdate(product._id, {
        $inc: { "inventory.quantity": -item.quantity },
      });
    }

    // Get entrepreneur from first product (assuming single seller order for simplicity)
    const firstProduct = await Product.findById(
      validatedData.items[0].product
    ).populate("entrepreneur");

    // Calculate shipping (simplified)
    const shipping = subtotal > 5000 ? 0 : 250;

    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: session.user.id,
      entrepreneur: firstProduct?.entrepreneur._id,
      items: orderItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      shippingAddress: validatedData.shippingAddress,
      paymentMethod: validatedData.paymentMethod,
      status: "pending",
      paymentStatus: "pending",
      timeline: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Order placed",
        },
      ],
    });

    // Create notification for entrepreneur
    await Notification.create({
      recipient: firstProduct?.entrepreneur.user,
      type: "order",
      title: "New Order Received",
      message: `You have received a new order #${order.orderNumber}`,
      link: `/entrepreneur/orders/${order._id}`,
      relatedId: order._id,
      relatedModel: "Order",
    });

    // Populate and return
    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "firstName lastName email")
      .populate({
        path: "entrepreneur",
        select: "businessName user",
        populate: { path: "user", select: "firstName lastName" },
      })
      .populate("items.product", "title images");

    return NextResponse.json(
      { success: true, data: populatedOrder },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
