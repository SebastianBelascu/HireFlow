import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default async function ApplicationsPage() {
  const session = await getAuthSession();

  const applications = await prisma.jobApplication.findMany({
    where: {
      user_id: session?.user.id,
    },
    include: {
      job: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>My Applications</h2>
        <p className='text-muted-foreground'>
          Track the status of your job applications
        </p>
      </div>

      {applications.length > 0 ? (
        <div className='grid gap-6'>
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader className='flex flex-row items-start justify-between'>
                <div>
                  <CardTitle>{application.job.title}</CardTitle>
                  <CardDescription>
                    {application.job.companyName}
                  </CardDescription>
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
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between text-sm'>
                  <div className='flex items-center'>
                    <span className='text-muted-foreground'>Applied:</span>
                    <span className='ml-1'>
                      {formatDistanceToNow(new Date(application.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <Button size='sm' variant='outline' asChild>
                    <Link href={`/jobs/${application.job.id}`}>View Job</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <ClipboardList className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium mb-2'>No applications yet</h3>
          <p className='text-sm text-muted-foreground mb-4 max-w-md'>
            You haven&apos;t applied to any jobs yet. Browse available jobs and
            apply to get started.
          </p>
          <Button asChild>
            <Link href='/jobs'>Browse Jobs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
