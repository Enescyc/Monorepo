import { API_ROUTES } from '@/config/api';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const resetSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = resetSchema.parse(body);

    // TODO: Replace with your actual API endpoint
    const response = await fetch(API_ROUTES.auth.resetPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || 'Password reset request failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: 'Password reset instructions have been sent to your email'
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 