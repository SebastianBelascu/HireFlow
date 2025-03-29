import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// POST endpoint to save user feedback on job recommendations
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { jobId, liked } = await request.json();

    if (!jobId || liked === undefined) {
      return NextResponse.json(
        { error: 'Job ID and feedback are required' },
        { status: 400 }
      );
    }

    // In a production environment, you would save this to a database
    // For now, we'll just log it
    console.log(`User ${userId} ${liked ? 'liked' : 'disliked'} job ${jobId}`);

    // This would be implemented when we have a feedback table in the database
    // await prisma.feedback.upsert({
    //   where: {
    //     userId_jobId: {
    //       userId,
    //       jobId,
    //     },
    //   },
    //   update: {
    //     liked,
    //   },
    //   create: {
    //     userId,
    //     jobId,
    //     liked,
    //   },
    // });

    return NextResponse.json(
      { success: true, message: 'Feedback saved successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
