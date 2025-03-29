import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with server-side environment variables
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET a specific job by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

// DELETE a job by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

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

    // Check if the job exists
    const job = await prisma.job.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if the user is the creator of the job
    if (job.userId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this job' },
        { status: 403 }
      );
    }

    // Delete the job
    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Job deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
