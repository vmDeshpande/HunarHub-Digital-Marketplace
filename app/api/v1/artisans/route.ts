import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { EntrepreneurProfile, User, Product, Service, Review } from '@/lib/db/models';

// GET /api/v1/artisans - Get all artisans (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skills = searchParams.get('skills')?.split(',');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'rating';

    // Build query
    const query: Record<string, unknown> = { isVerified: true };
    
    if (skills?.length) {
      query.skills = { $in: skills };
    }
    
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { specializations: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    // Sort options
    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      rating: { 'stats.averageRating': -1 },
      products: { 'stats.totalProducts': -1 },
      newest: { createdAt: -1 },
      name: { businessName: 1 },
    };

    const skip = (page - 1) * limit;
    
    const [artisans, total] = await Promise.all([
      EntrepreneurProfile.find(query)
        .populate('user', 'firstName lastName avatar')
        .sort(sortOptions[sortBy] || sortOptions.rating)
        .skip(skip)
        .limit(limit)
        .lean(),
      EntrepreneurProfile.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        artisans,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching artisans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artisans' },
      { status: 500 }
    );
  }
}
