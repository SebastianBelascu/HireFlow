import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from the database to ensure we have the ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { message: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    // Check if user has already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        job_id_user_id: {
          job_id: jobId,
          user_id: user.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    // Check if user has a CV
    const profile = await prisma.profile.findUnique({
      where: {
        user_id: user.id,
      },
    });

    if (!profile?.cv_url) {
      return NextResponse.json(
        { message: 'You need to upload a CV before applying' },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        job_id: jobId,
        user_id: user.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { message: 'Application submitted successfully', application },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { message: 'Error submitting application' },
      { status: 500 }
    );
  }
}
