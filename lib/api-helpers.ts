import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Global error boundary for API routes
export function handleApiError(
  error: unknown,
  context: {
    endpoint: string;
    method: string;
    statusCode?: number;
  }
) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  let message = 'Internal Server Error';
  let statusCode = context.statusCode || 500;

  if (error instanceof Error) {
    message = isDevelopment ? error.message : 'An error occurred';

    if (isDevelopment) {
      console.error(`[${context.method} ${context.endpoint}]`, error);
    }

    // Specific error handling
    if (error.message.includes('validation')) {
      statusCode = 400;
      message = 'Validation failed';
    } else if (error.message.includes('not found')) {
      statusCode = 404;
      message = 'Resource not found';
    } else if (error.message.includes('unauthorized')) {
      statusCode = 401;
      message = 'Unauthorized access';
    } else if (error.message.includes('forbidden')) {
      statusCode = 403;
      message = 'Access forbidden';
    }
  }

  return NextResponse.json(
    {
      status: 'error',
      error: message,
      ...(isDevelopment && { details: error instanceof Error ? error.stack : String(error) }),
    },
    { status: statusCode }
  );
}

// Success response helper
export function handleSuccess<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      status: 'success',
      data,
      message,
    },
    { status: statusCode }
  );
}

// Validation error response
export function handleValidationError(errors: Record<string, string[]>) {
  return NextResponse.json(
    {
      status: 'error',
      error: 'Validation failed',
      errors,
    },
    { status: 400 }
  );
}
