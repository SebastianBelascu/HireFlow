import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import {
  BriefcaseBusiness,
  Building,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApplyButton } from './apply-button';
import { BookmarkButton } from './bookmark-button';
import ReactMarkdown from 'react-markdown';

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  description: string;
  required_skills: string[];
  salary_min: number | null;
  salary_max: number | null;
}

export default async function JobPage({ params }: { params: { id: string } }) {
  const session = await getAuthSession();
  const jobId = await params.id;

  // Get the user from the database to ensure we have the ID and role
  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true },
      })
    : null;

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    notFound();
  }

  // Check if user has already applied
  const existingApplication = user
    ? await prisma.jobApplication.findUnique({
        where: {
          job_id_user_id: {
            job_id: job.id,
            user_id: user.id,
          },
        },
      })
    : null;

  // Get user profile to check if they have a CV
  const profile = user
    ? await prisma.profile.findUnique({
        where: {
          user_id: user.id,
        },
      })
    : null;

  const hasCV = !!profile?.cv_url;
  const hasApplied = !!existingApplication;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>{job.title}</h2>
          <p className='text-muted-foreground'>{job.company_name}</p>
        </div>
        <div className='flex items-center gap-4'>
          {user?.role === 'ADMIN' && (
            <Button asChild variant='outline'>
              <Link href={`/admin/jobs/${job.id}`}>Edit Job</Link>
            </Button>
          )}
          <BookmarkButton jobId={job.id} />
          <ApplyButton jobId={job.id} disabled={hasApplied} hasCV={hasCV} />
        </div>
      </div>

      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
        <div className='flex items-center'>
          <MapPin className='mr-1 h-4 w-4' />
          {job.location}
        </div>
        <div className='flex items-center'>
          <BriefcaseBusiness className='mr-1 h-4 w-4' />
          {job.job_type}
        </div>
        {job.salary_min && job.salary_max && (
          <div className='flex items-center'>
            <DollarSign className='mr-1 h-4 w-4' />$
            {job.salary_min.toLocaleString()} - $
            {job.salary_max.toLocaleString()}
          </div>
        )}
      </div>

      <div className='flex flex-wrap gap-2'>
        {job.required_skills &&
          job.required_skills.map((skill: string, index: number) => (
            <div
              key={index}
              className='rounded-full bg-secondary px-3 py-1 text-xs'
            >
              {skill}
            </div>
          ))}
      </div>

      <div className='prose max-w-none'>
        <ReactMarkdown>{job.description}</ReactMarkdown>
      </div>
    </div>
  );
}
