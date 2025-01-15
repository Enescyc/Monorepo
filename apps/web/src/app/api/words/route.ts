import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LearningStatus, WordType } from '@vocabuddy/types';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API_URL environment variable is not defined');
    }

    const response = await fetch(`${apiUrl}/words?${new URLSearchParams({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    })}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch words');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API_URL environment variable is not defined');
    }

    const { word } = await req.json();

    // Create word with user settings from session
    const wordData = {
      word,
      userId: session.user.id,
      nativeLanguage: session.user.languages.find(lang => lang.native)?.code || 'en',
      targetLanguages: session.user.languages.filter(lang => !lang.native),
      learningStyle: session.user.settings?.learningStyle?.[0] || 'VISUAL',
      difficulty: session.user.settings?.difficulty || 'EASY',
      appLanguage: session.user.appLanguage || 'en',
    };

    console.log('Sending word data:', wordData);

    const response = await fetch(`${apiUrl}/words`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });
      throw new Error(`Failed to create word: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating word:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
} 