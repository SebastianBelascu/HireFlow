import { NextResponse } from 'next/server';
import { testBucketAccess } from '@/lib/supabase-storage';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contents = await testBucketAccess();
    return NextResponse.json({
      message: 'Storage access successful',
      contents,
      user: session.user,
    });
  } catch (error) {
    console.error('Storage test error:', error);
    return NextResponse.json(
      {
        error: 'Storage access failed',
        details: error,
      },
      { status: 500 }
    );
  }
}
