import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user's bookmarks with job details
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        user_id: session.user.id,
      },
      include: {
        job: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Extract job details from bookmarks
    const bookmarkedJobs = bookmarks.map((bookmark) => bookmark.job);

    return NextResponse.json({ bookmarks: bookmarkedJobs });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { message: 'Error fetching bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { message: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        user_id_job_id: {
          user_id: session.user.id,
          job_id: jobId,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { message: 'Job already bookmarked' },
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
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        user_id: session.user.id,
        job_id: jobId,
      },
    });

    return NextResponse.json(
      { message: 'Job bookmarked successfully', bookmark },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error bookmarking job:', error);
    return NextResponse.json(
      { message: 'Error bookmarking job' },
      { status: 500 }
    );
  }
}
