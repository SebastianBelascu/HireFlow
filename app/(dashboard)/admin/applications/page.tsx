import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get status filter
  const status =
    typeof searchParams.status === 'string' ? searchParams.status : '';

  // Build filter condition
  const where: any = {};

  if (status && status !== 'all') {
    where.status = status;
  }

  // Get applications with filter
  const applications = await prisma.jobApplication.findMany({
    where,
    include: {
      job: true,
      user: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>
          Manage Applications
        </h2>
        <p className='text-muted-foreground'>
          Review and update application statuses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
          <CardDescription>Filter applications by status</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='flex items-center gap-4'>
            <div className='w-[200px]'>
              <Select name='status' defaultValue={status || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value='PENDING'>Pending</SelectItem>
                  <SelectItem value='REVIEWED'>Reviewed</SelectItem>
                  <SelectItem value='ACCEPTED'>Accepted</SelectItem>
                  <SelectItem value='REJECTED'>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type='submit'>Filter</Button>
          </form>
        </CardContent>
      </Card>

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
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Applicant
                    </p>
                    <p>{application.user.name || application.user.email}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Applied
                    </p>
                    <p>
                      {formatDistanceToNow(new Date(application.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <Button size='sm' variant='outline' asChild>
                    <Link href={`/admin/applications/${application.id}`}>
                      Review Application
                    </Link>
                  </Button>
                  <Button size='sm' variant='outline' asChild>
                    <Link href={`/admin/jobs/${application.job.id}`}>
                      View Job
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <ClipboardList className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium mb-2'>No applications found</h3>
          <p className='text-sm text-muted-foreground mb-4 max-w-md'>
            No applications match your filter criteria. Try adjusting your
            filters.
          </p>
          <Button asChild>
            <Link href='/admin/applications'>Clear Filters</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
