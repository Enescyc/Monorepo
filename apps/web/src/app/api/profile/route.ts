import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { Session } from 'next-auth';

export async function GET() {
  try {
    const session = await getAuthSession() as Session;
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!session.user.id) {
      console.error('[PROFILE_GET] No user ID in session', session);
      return new NextResponse('User ID not found', { status: 400 });
    }

    console.log('[PROFILE_GET] Fetching user:', session.user.id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PROFILE_GET] API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
    }

    const user = await response.json();
    console.log('[PROFILE_GET] User fetched successfully');
    return NextResponse.json(user);
  } catch (error) {
    console.error('[PROFILE_GET]', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Error', 
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession() as Session;
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!session.user.id) {
      console.error('[PROFILE_UPDATE] No user ID in session', session);
      return new NextResponse('User ID not found', { status: 400 });
    }

    const body = await req.json();
    const { name, username, email, appLanguage } = body;

    console.log('[PROFILE_UPDATE] Updating user:', session.user.id, body);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        username,
        email,
        appLanguage,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PROFILE_UPDATE] API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
    }

    const updatedUser = await response.json();
    console.log('[PROFILE_UPDATE] User updated successfully');
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[PROFILE_UPDATE]', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Error',
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession() as Session;
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!session.user.id) {
      console.error('[PROFILE_DELETE] No user ID in session', session);
      return new NextResponse('User ID not found', { status: 400 });
    }

    console.log('[PROFILE_DELETE] Deleting user:', session.user.id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PROFILE_DELETE] API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to delete account: ${response.status} ${response.statusText}`);
    }

    console.log('[PROFILE_DELETE] User deleted successfully');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PROFILE_DELETE]', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Error',
      { status: 500 }
    );
  }
} 