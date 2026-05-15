import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import dbConnect from '@/lib/db/mongoose';
import { ServiceRequest, Service, Notification } from '@/lib/db/models';
import { nanoid } from 'nanoid';

// GET /api/v1/service-requests - Get service requests
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};
    
    // Customer sees their requests, entrepreneur sees requests for their services
    if (session.user.role === 'customer') {
      query.customer = session.user.id;
    } else if (session.user.role === 'entrepreneur') {
      query.entrepreneur = session.user.id;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      ServiceRequest.find(query)
        .populate('service', 'title slug images')
        .populate('customer', 'firstName lastName email avatar')
        .populate('entrepreneur', 'businessName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ServiceRequest.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service requests' },
      { status: 500 }
    );
  }
}

// POST /api/v1/service-requests - Create a service request
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();

    const { service: serviceId, entrepreneur, requirements, contactInfo, notes } = body;

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    // Create service request
    const serviceRequest = await ServiceRequest.create({
      requestNumber: `SR-${nanoid(8).toUpperCase()}`,
      service: serviceId,
      customer: session.user.id,
      entrepreneur,
      requirements: {
        description: requirements.description,
        deadline: requirements.deadline,
        budget: requirements.budget,
      },
      contactInfo: {
        phone: contactInfo.phone,
        email: session.user.email,
      },
      notes,
      status: 'pending',
    });

    // Update service stats
    await Service.findByIdAndUpdate(serviceId, {
      $inc: { 'stats.totalRequests': 1 },
    });

    // Create notification for entrepreneur
    await Notification.create({
      user: entrepreneur,
      type: 'service_request',
      title: 'New Service Request',
      message: `You have a new request for "${service.title}"`,
      data: {
        serviceRequestId: serviceRequest._id,
        serviceId,
      },
    });

    return NextResponse.json({
      success: true,
      data: { serviceRequest },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating service request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}
