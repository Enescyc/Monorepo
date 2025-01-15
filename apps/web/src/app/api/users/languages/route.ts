import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { code, name, proficiency, native } = body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/languages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        code,
        name,
        proficiency,
        native,
        startedAt: new Date(),
        lastStudied: new Date(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return new NextResponse(error.message || 'Failed to add language', { 
        status: response.status 
      });
    }

    const updatedUser = await response.json();
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[LANGUAGE_ADD]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return new NextResponse('Language code is required', { status: 400 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/languages/${code}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return new NextResponse(error.message || 'Failed to remove language', { 
        status: response.status 
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[LANGUAGE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 