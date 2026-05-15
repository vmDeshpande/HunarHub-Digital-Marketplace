import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Product, Service, EntrepreneurProfile } from '@/lib/db/models';

// GET /api/v1/search - Global search across products, services, and artisans
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // all, products, services, artisans
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: { products: [], services: [], artisans: [] },
      });
    }

    const searchRegex = { $regex: query, $options: 'i' };

    const results: {
      products: unknown[];
      services: unknown[];
      artisans: unknown[];
    } = {
      products: [],
      services: [],
      artisans: [],
    };

    // Search products
    if (type === 'all' || type === 'products') {
      results.products = await Product.find({
        status: 'active',
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: { $elemMatch: searchRegex } },
        ],
      })
        .populate('entrepreneur', 'businessName')
        .select('title slug images price compareAtPrice stats')
        .limit(limit)
        .lean();
    }

    // Search services
    if (type === 'all' || type === 'services') {
      results.services = await Service.find({
        status: 'active',
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: { $elemMatch: searchRegex } },
        ],
      })
        .populate('entrepreneur', 'businessName')
        .select('title slug images pricing stats')
        .limit(limit)
        .lean();
    }

    // Search artisans
    if (type === 'all' || type === 'artisans') {
      results.artisans = await EntrepreneurProfile.find({
        isVerified: true,
        $or: [
          { businessName: searchRegex },
          { bio: searchRegex },
          { specializations: { $elemMatch: searchRegex } },
        ],
      })
        .populate('user', 'firstName lastName avatar')
        .select('businessName coverImage stats location specializations')
        .limit(limit)
        .lean();
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
