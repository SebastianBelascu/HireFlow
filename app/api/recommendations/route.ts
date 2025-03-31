import { getAuthSession } from '@/lib/auth';
import { getJobRecommendations } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: {
        user_id: session.user.id,
      },
    });

    if (!profile || !profile.cv_url) {
      return NextResponse.json(
        { message: 'Profile or CV not found' },
        { status: 404 }
      );
    }

    // Get all jobs
    const jobs = await prisma.job.findMany();

    if (jobs.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }

    // Get recommendations using AI
    const recommendations = await getJobRecommendations(profile, jobs);

    // Get full job details for recommended jobs
    const recommendedJobs = await Promise.all(
      recommendations.map(async (rec: any) => {
        const job = await prisma.job.findUnique({
          where: {
            id: rec.jobId,
          },
        });

        return {
          ...job,
          relevanceScore: rec.relevanceScore,
          reasons: rec.reasons,
        };
      })
    );

    return NextResponse.json({
      recommendations: recommendedJobs.filter(Boolean),
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { message: 'Error getting recommendations' },
      { status: 500 }
    );
  }
}
