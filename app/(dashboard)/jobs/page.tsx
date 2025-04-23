import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BriefcaseBusiness, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getAuthSession();

  // Get search parameters
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : '';
  const location =
    typeof searchParams.location === 'string' ? searchParams.location : '';
  const jobType =
    typeof searchParams.jobType === 'string' ? searchParams.jobType : '';

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

  // Get user profile for recommendations
  const profile = await prisma.profile.findUnique({
    where: {
      user_id: session?.user.id,
    },
  });

  // In a real app, you would use AI to rank jobs based on profile match
  // For this example, we'll just mark some jobs as recommended if the user has a profile
  const recommendedJobIds = profile
    ? jobs.slice(0, 3).map((job) => job.id)
    : [];

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Browse Jobs</h2>
        <p className='text-muted-foreground'>
          Find the perfect job opportunity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Jobs</CardTitle>
          <CardDescription>
            Filter jobs by keyword, location, and job type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='grid gap-4 md:grid-cols-4'>
            <div className='md:col-span-2'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search jobs...'
                  className='pl-8'
                  name='search'
                  defaultValue={search}
                />
              </div>
            </div>
            <div>
              <Select name='location' defaultValue={location || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder='Location' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Locations</SelectItem>
                  <SelectItem value='Remote'>Remote</SelectItem>
                  <SelectItem value='Hybrid'>Hybrid</SelectItem>
                  <SelectItem value='Onsite'>Onsite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select name='jobType' defaultValue={jobType || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder='Job Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  <SelectItem value='Full-time'>Full-time</SelectItem>
                  <SelectItem value='Part-time'>Part-time</SelectItem>
                  <SelectItem value='Contract'>Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='md:col-span-4'>
              <Button type='submit' className='w-full md:w-auto'>
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className='grid gap-6'>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card
              key={job.id}
              className={
                recommendedJobIds.includes(job.id) ? 'border-primary' : ''
              }
            >
              {recommendedJobIds.includes(job.id) && (
                <div className='bg-primary text-primary-foreground text-xs px-3 py-1 absolute right-4 top-4 rounded-full'>
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.company_name}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center text-sm text-muted-foreground flex-wrap gap-2 sm:gap-0'>
                  <div className="flex items-center">
                    <MapPin className='mr-1 h-4 w-4' />
                    {job.location}
                  </div>
                  <span className='hidden sm:block mx-2'>•</span>
                  <div className="flex items-center">
                    <BriefcaseBusiness className='mr-1 h-4 w-4' />
                    {job.job_type}
                  </div>
                  {job.salary_min && job.salary_max && (
                    <>
                      <span className='hidden sm:block mx-2'>•</span>
                      <div className="flex items-center">
                        ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <p className='line-clamp-3 text-sm'>{job.description}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {job.required_skills && job.required_skills.length > 0 && (
                    <>
                      {job.required_skills.slice(0, 5).map((skill, index) => (
                        <div
                          key={index}
                          className='rounded-full bg-secondary px-3 py-1 text-xs'
                        >
                          {skill}
                        </div>
                      ))}
                      {job.required_skills.length > 5 && (
                        <div className='rounded-full bg-secondary px-3 py-1 text-xs'>
                          +{job.required_skills.length - 5} more
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/jobs/${job.id}`}>View Job</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <BriefcaseBusiness className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-medium mb-2'>No jobs found</h3>
            <p className='text-sm text-muted-foreground mb-4 max-w-md'>
              No jobs match your search criteria. Try adjusting your filters or
              check back later.
            </p>
            <Button asChild>
              <Link href='/jobs'>Clear Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
