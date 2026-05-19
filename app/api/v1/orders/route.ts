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
      const productId = item.product || item.productId;

      if (!productId) {
        return NextResponse.json(
          { success: false, error: "Product is required for every order item" },
          { status: 400 }
        );
      }

      const product = await Product.findById(productId).populate(
        "entrepreneur"
      );

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${productId} not found` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
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
        title: product.title,
        image: product.images[0],
        quantity: item.quantity,
        price: product.price,
        selectedVariant: item.selectedVariant || item.variant,
        subtotal: product.price * item.quantity,
      });

      subtotal += product.price * item.quantity;

      // Update inventory
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Get entrepreneur from first product (assuming single seller order for simplicity)
    const firstProductId = validatedData.items[0].product || validatedData.items[0].productId;
    const firstProduct = await Product.findById(
      firstProductId
    ).populate("entrepreneur");

    // Calculate shipping (simplified)
    const shipping = subtotal > 5000 ? 0 : 250;

    const shippingAddress = {
      name: validatedData.shippingAddress.name || validatedData.shippingAddress.fullName,
      phone: validatedData.shippingAddress.phone,
      street: validatedData.shippingAddress.street || validatedData.shippingAddress.address,
      city: validatedData.shippingAddress.city,
      state: validatedData.shippingAddress.state,
      postalCode: validatedData.shippingAddress.postalCode,
      country: validatedData.shippingAddress.country,
    };

    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: session.user.id,
      entrepreneur: firstProduct?.entrepreneur._id,
      items: orderItems,
      subtotal,
      shippingCost: shipping,
      discount: 0,
      total: subtotal + shipping,
      shippingAddress,
      paymentMethod: validatedData.paymentMethod,
      customerNotes: validatedData.customerNotes || validatedData.notes,
      status: "pending",
      paymentStatus: "pending",
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Order placed",
        },
      ],
    });

    // Create notification for entrepreneur
    const entrepreneurProfile = firstProduct?.entrepreneur as any;
    await Notification.create({
      user: entrepreneurProfile?.user,
      type: "order_placed",
      title: "New Order Received",
      message: `You have received a new order #${order.orderNumber}`,
      link: `/entrepreneur/orders/${order._id}`,
      data: { orderId: order._id },
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
