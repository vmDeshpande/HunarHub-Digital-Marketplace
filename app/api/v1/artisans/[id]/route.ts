import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import { EntrepreneurProfile, Product, Service, Review } from '@/lib/db/models';

// GET /api/v1/artisans/[id] - Get artisan profile with products and services
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid artisan ID format' },
        { status: 400 }
      );
    }

    const artisan = await EntrepreneurProfile.findById(id)
      .populate('user', 'firstName lastName avatar email createdAt')
      .lean();

    if (!artisan) {
      return NextResponse.json(
        { success: false, error: 'Artisan not found' },
        { status: 404 }
      );
    }

    // Get artisan's products
    const products = await Product.find({ 
      entrepreneur: id, 
      status: 'active' 
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    // Get artisan's services
    const services = await Service.find({ 
      entrepreneur: id, 
      status: 'active' 
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Get reviews for this artisan's products/services
    const productIds = products.map(p => p._id);
    const serviceIds = services.map(s => s._id);
    
    const reviews = await Review.find({
      $or: [
        { product: { $in: productIds } },
        { service: { $in: serviceIds } },
      ],
      status: 'approved',
    })
      .populate('customer', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        artisan,
        products,
        services,
        reviews,
      },
    });
  } catch (error) {
    // Handle MongoDB CastError for invalid ObjectIds
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    console.error('Error fetching artisan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artisan' },
      { status: 500 }
    );
  }
}
