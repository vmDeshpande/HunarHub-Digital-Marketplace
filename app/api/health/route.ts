import { connectToDatabase } from '@/lib/db/mongoose';
import { NextResponse } from 'next/server';

export const revalidate = 0; // Disable caching for health check

export async function GET() {
  try {
    const startTime = Date.now();

    // Check database connection
    await connectToDatabase();
    const dbTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        database: 'connected',
        responseTime: `${dbTime}ms`,
        version: '1.0.0',
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: errorMessage,
        environment: process.env.NODE_ENV,
      },
      { status: 503 }
    );
  }
}
