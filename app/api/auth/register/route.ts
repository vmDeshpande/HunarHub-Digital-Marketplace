import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import User from '@/lib/db/models/user.model';
import { signUpSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signUpSchema.parse(body);
    
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({
      email: validatedData.email.toLowerCase(),
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      password: validatedData.password,
      role: validatedData.role,
      status: 'active',
    });
    
    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
