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

// GET applications for the current user
export async function GET(request: NextRequest) {
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

    // Get all applications for the current user
    const applications = await prisma.application.findMany({
      where: {
        userId,
      },
      include: {
        job: true,
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST a new application
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

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
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if the user has already applied for this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        userId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        jobId,
        userId,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
