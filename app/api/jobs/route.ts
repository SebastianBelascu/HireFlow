import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      companyName,
      location,
      description,
      requiredSkills,
      salaryMin,
      salaryMax,
      jobType,
    } = await req.json();

    // Validate required fields
    if (!title || !companyName || !location || !description || !jobType) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        company_name: companyName,
        location,
        description,
        required_skills: requiredSkills,
        salary_min: salaryMin,
        salary_max: salaryMax,
        job_type: jobType,
        created_by: session.user.id,
      },
    });

    return NextResponse.json(
      { message: 'Job created successfully', job },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { message: 'Error creating job' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const jobType = searchParams.get('jobType');

    // Build filter conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location && location !== 'all') {
      where.location = location;
    }

    if (jobType && jobType !== 'all') {
      where.job_type = jobType;
    }

    // Get jobs with filters
    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { message: 'Error fetching jobs' },
      { status: 500 }
    );
  }
}
