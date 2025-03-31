'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Bookmark, BriefcaseBusiness, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  description: string;
  requiredSkills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('/api/bookmarks');

        if (!response.ok) {
          throw new Error('Failed to fetch bookmarks');
        }

        const data = await response.json();
        setBookmarks(data.bookmarks || []);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch bookmarks',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [toast]);

  const handleRemoveBookmark = async (jobId: string) => {
    try {
      const response = await fetch(`/api/bookmarks/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove bookmark');
      }

      setBookmarks(bookmarks.filter((job) => job.id !== jobId));

      toast({
        title: 'Bookmark removed',
        description: 'Job has been removed from your bookmarks',
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove bookmark',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>My Bookmarks</h2>
          <p className='text-muted-foreground'>Jobs you've saved for later</p>
        </div>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>My Bookmarks</h2>
        <p className='text-muted-foreground'>Jobs you've saved for later</p>
      </div>

      {bookmarks.length > 0 ? (
        <div className='grid gap-6'>
          {bookmarks.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.companyName}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <MapPin className='mr-1 h-4 w-4' />
                  {job.location}
                  <span className='mx-2'>•</span>
                  <BriefcaseBusiness className='mr-1 h-4 w-4' />
                  {job.jobType}
                  {job.salaryMin && job.salaryMax && (
                    <>
                      <span className='mx-2'>•</span>$
                      {job.salaryMin.toLocaleString()} - $
                      {job.salaryMax.toLocaleString()}
                    </>
                  )}
                </div>
                <div>
                  <p className='line-clamp-3 text-sm'>{job.description}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
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
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button asChild>
                  <Link href={`/jobs/${job.id}`}>View Job</Link>
                </Button>
                <Button
                  variant='outline'
                  onClick={() => handleRemoveBookmark(job.id)}
                >
                  Remove Bookmark
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <Bookmark className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium mb-2'>No bookmarks yet</h3>
          <p className='text-sm text-muted-foreground mb-4 max-w-md'>
            You haven't bookmarked any jobs yet. Browse jobs and bookmark the
            ones you're interested in.
          </p>
          <Button asChild>
            <Link href='/jobs'>Browse Jobs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
