import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { BriefcaseBusiness, FileText, Users } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  // Get counts for dashboard
  const jobsCount = await prisma.job.count();
  const applicationsCount = await prisma.jobApplication.count();
  const usersCount = await prisma.user.count();

  // Get recent jobs
  const recentJobs = await prisma.job.findMany({
    orderBy: {
      created_at: 'desc',
    },
    take: 5,
  });

  // Get recent applications
  const recentApplications = await prisma.jobApplication.findMany({
    include: {
      job: true,
      user: true,
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 5,
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Admin Dashboard</h2>
          <p className='text-muted-foreground'>
            Manage jobs, applications, and users
          </p>
        </div>
        <Button asChild>
          <Link href='/admin/jobs/new'>
            <BriefcaseBusiness className='mr-2 h-4 w-4' />
            Post New Job
          </Link>
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Jobs</CardTitle>
            <BriefcaseBusiness className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{jobsCount}</div>
            <p className='text-xs text-muted-foreground'>
              Jobs posted on the platform
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Applications
            </CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{applicationsCount}</div>
            <p className='text-xs text-muted-foreground'>
              Applications submitted by users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{usersCount}</div>
            <p className='text-xs text-muted-foreground'>
              Registered users on the platform
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Recently posted job listings</CardDescription>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <div className='space-y-4'>
                {recentJobs.map((job) => (
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
                    <Button size='sm' variant='outline' asChild>
                      <Link href={`/admin/jobs/${job.id}`}>Edit</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex h-[100px] items-center justify-center rounded-md border border-dashed'>
                <p className='text-sm text-muted-foreground'>
                  No jobs posted yet
                </p>
              </div>
            )}
          </CardContent>
          <CardHeader className='pt-0'>
            <Button variant='outline' size='sm' className='w-full' asChild>
              <Link href='/admin/jobs'>View All Jobs</Link>
            </Button>
          </CardHeader>
        </Card>

        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Recently submitted job applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className='space-y-4'>
                {recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className='flex items-center justify-between'
                  >
                    <div className='space-y-1'>
                      <p className='font-medium'>{application.job.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        {application.user.name || application.user.email}
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
          <CardHeader className='pt-0'>
            <Button variant='outline' size='sm' className='w-full' asChild>
              <Link href='/admin/applications'>View All Applications</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
