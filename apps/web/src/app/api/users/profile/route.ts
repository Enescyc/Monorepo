import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, username } = body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ name, username }),
    });

    if (!response.ok) {
      const error = await response.json();
      return new NextResponse(error.message || 'Failed to update profile', { 
        status: response.status 
      });
    }

    const updatedUser = await response.json();
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[PROFILE_UPDATE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 