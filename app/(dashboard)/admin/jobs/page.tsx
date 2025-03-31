import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';
import { BriefcaseBusiness, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get search parameter
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : '';

  // Build filter condition
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Get jobs with filter
  const jobs = await prisma.job.findMany({
    where,
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Manage Jobs</h2>
          <p className='text-muted-foreground'>
            Create, edit, and delete job listings
          </p>
        </div>
        <Button asChild>
          <Link href='/admin/jobs/new'>
            <Plus className='mr-2 h-4 w-4' />
            Post New Job
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Jobs</CardTitle>
          <CardDescription>Find jobs by title or company name</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='flex items-center gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search jobs...'
                className='pl-8'
                name='search'
                defaultValue={search}
              />
            </div>
            <Button type='submit'>Search</Button>
          </form>
        </CardContent>
      </Card>

      <div className='grid gap-6'>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.companyName}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <span>{job.location}</span>
                  <span className='mx-2'>•</span>
                  <span>{job.jobType}</span>
                  {job.salaryMin && job.salaryMax && (
                    <>
                      <span className='mx-2'>•</span>$
                      {job.salaryMin.toLocaleString()} - $
                      {job.salaryMax.toLocaleString()}
                    </>
                  )}
                </div>
                <div className='flex flex-wrap gap-2'>
                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <>
                      {job.requiredSkills.slice(0, 5).map((skill, index) => (
                        <div
                          key={index}
                          className='rounded-full bg-secondary px-3 py-1 text-xs'
                        >
                          {skill}
                        </div>
                      ))}
                      {job.requiredSkills.length > 5 && (
                        <div className='rounded-full bg-secondary px-3 py-1 text-xs'>
                          +{job.requiredSkills.length - 5} more
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className='flex items-center gap-4'>
                  <Button size='sm' variant='outline' asChild>
                    <Link href={`/admin/jobs/${job.id}`}>Edit</Link>
                  </Button>
                  <Button size='sm' variant='outline' asChild>
                    <Link href={`/admin/jobs/${job.id}/applications`}>
                      View Applications
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <BriefcaseBusiness className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-medium mb-2'>No jobs found</h3>
            <p className='text-sm text-muted-foreground mb-4 max-w-md'>
              {search
                ? 'No jobs match your search criteria. Try adjusting your search.'
                : "You haven't posted any jobs yet. Create your first job listing."}
            </p>
            <Button asChild>
              <Link href='/admin/jobs/new'>Post New Job</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
