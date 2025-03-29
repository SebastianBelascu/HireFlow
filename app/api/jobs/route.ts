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

// GET all jobs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST a new job
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { title, company, location, description, salary } = body;

    // Validate required fields
    if (!title || !company || !location || !description) {
      return NextResponse.json(
        {
          error:
            'Title, company, location, and description are required fields',
        },
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

    // Validate salary if provided
    let parsedSalary = null;
    if (salary) {
      parsedSalary = parseInt(salary);
      if (isNaN(parsedSalary)) {
        return NextResponse.json(
          { error: 'Salary must be a valid number' },
          { status: 400 }
        );
      }
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        description,
        salary: parsedSalary,
        userId,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
