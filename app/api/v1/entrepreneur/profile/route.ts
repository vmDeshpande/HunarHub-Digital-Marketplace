import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import dbConnect from '@/lib/db/mongoose';
import { EntrepreneurProfile } from '@/lib/db/models';

// GET /api/v1/entrepreneur/profile - Get current entrepreneur's profile
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'entrepreneur') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    let profile = await EntrepreneurProfile.findOne({ user: session.user.id }).lean();
    
    // Create profile if it doesn't exist
    if (!profile) {
      profile = await EntrepreneurProfile.create({
        user: session.user.id,
        businessName: `${session.user.name}'s Workshop`,
        bio: '',
        location: {
          city: '',
          state: '',
          country: 'Pakistan',
        },
        contactInfo: {
          email: session.user.email,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    console.error('Error fetching entrepreneur profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/entrepreneur/profile - Update entrepreneur profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'entrepreneur') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();

    const allowedFields = [
      'businessName',
      'bio',
      'coverImage',
      'location',
      'contactInfo',
      'socialLinks',
      'specializations',
      'workingHours',
      'policies',
    ];

    const updateData: Record<string, unknown> = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const profile = await EntrepreneurProfile.findOneAndUpdate(
      { user: session.user.id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    console.error('Error updating entrepreneur profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
