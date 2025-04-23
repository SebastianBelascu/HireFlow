import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const jobId = await params.id;

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { message: 'Error fetching job' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const jobId = await params.id;

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

    // Update job
    const job = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        title,
        company_name: companyName,
        location,
        description,
        required_skills: requiredSkills,
        salary_min: salaryMin,
        salary_max: salaryMax,
        job_type: jobType,
      },
    });

    return NextResponse.json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { message: 'Error updating job' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const jobId = await params.id;

    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { message: 'Error deleting job' },
      { status: 500 }
    );
  }
}
