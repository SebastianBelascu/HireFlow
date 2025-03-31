import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BriefcaseBusiness, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getAuthSession();

  // Get user profile
  const profile = await prisma.profile.findUnique({
    where: {
      user_id: session?.user.id,
    },
  });

  // Get user applications
  const applications = await prisma.jobApplication.findMany({
    where: {
      user_id: session?.user.id,
    },
    include: {
      job: true,
    },
    take: 5,
  });

  // Get recommended jobs (in a real app, this would be based on AI recommendations)
  const recommendedJobs = await prisma.job.findMany({
    take: 3,
  });

  const hasCV = !!profile?.cv_url;

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
          <p className='text-muted-foreground'>
            Welcome back, {session?.user.name}!
          </p>
        </div>
      </div>

      {!hasCV && (
        <Card className='border-dashed border-primary/50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5 text-primary' />
              Get Started
            </CardTitle>
            <CardDescription>
              Upload your CV to get personalized job recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Our AI will analyze your CV and match you with the most relevant
              job opportunities.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href='/profile/cv'>Upload CV</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Job Applications
            </CardTitle>
            <BriefcaseBusiness className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{applications.length}</div>
            <p className='text-xs text-muted-foreground'>
              Total job applications
            </p>
          </CardContent>
          <CardFooter>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/applications'>View all applications</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Recommended Jobs
            </CardTitle>
            <Sparkles className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{recommendedJobs.length}</div>
            <p className='text-xs text-muted-foreground'>
              Jobs matching your profile
            </p>
          </CardContent>
          <CardFooter>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/jobs'>Browse all jobs</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Profile Status
            </CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {hasCV ? 'Complete' : 'Incomplete'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {hasCV
                ? 'Your profile is ready for job matching'
                : 'Upload your CV to complete your profile'}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/profile'>View profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your most recent job applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className='space-y-4'>
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className='flex items-center justify-between'
                  >
                    <div className='space-y-1'>
                      <p className='font-medium'>{application.job.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        {application.job.companyName}
                      </p>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        application.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'REVIEWED'
                          ? 'bg-blue-100 text-blue-800'
                          : application.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {application.status.charAt(0) +
                        application.status.slice(1).toLowerCase()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex h-[100px] items-center justify-center rounded-md border border-dashed'>
                <p className='text-sm text-muted-foreground'>
                  No applications yet
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant='outline' size='sm' className='w-full' asChild>
              <Link href='/applications'>View All Applications</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Recommended Jobs</CardTitle>
            <CardDescription>Jobs that match your profile</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendedJobs.length > 0 ? (
              <div className='space-y-4'>
                {recommendedJobs.map((job) => (
                  <div
                    key={job.id}
                    className='flex items-center justify-between'
                  >
                    <div className='space-y-1'>
                      <p className='font-medium'>{job.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        {job.companyName}
                      </p>
                    </div>
                    <Button size='sm' asChild>
                      <Link href={`/jobs/${job.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex h-[100px] items-center justify-center rounded-md border border-dashed'>
                <p className='text-sm text-muted-foreground'>
                  No recommendations yet
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant='outline' size='sm' className='w-full' asChild>
              <Link href='/jobs'>Browse All Jobs</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
