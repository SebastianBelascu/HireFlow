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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { BriefcaseBusiness, FileText, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  relevanceScore: number;
  reasons: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/recommendations');

        if (response.status === 404) {
          setHasProfile(false);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch job recommendations',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [toast]);

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            AI Recommendations
          </h2>
          <p className='text-muted-foreground'>
            Personalized job recommendations based on your profile
          </p>
        </div>
        <div className='grid gap-6'>
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2 mt-2' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <div className='flex flex-wrap gap-2'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className='h-6 w-16 rounded-full' />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className='h-10 w-24' />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            AI Recommendations
          </h2>
          <p className='text-muted-foreground'>
            Personalized job recommendations based on your profile
          </p>
        </div>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <FileText className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium mb-2'>
            Upload your CV to get recommendations
          </h3>
          <p className='text-sm text-muted-foreground mb-4 max-w-md'>
            We need your CV to analyze your skills and experience to provide
            personalized job recommendations.
          </p>
          <Button asChild>
            <Link href='/profile/cv'>Upload CV</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>
          AI Recommendations
        </h2>
        <p className='text-muted-foreground'>
          Personalized job recommendations based on your profile
        </p>
      </div>

      {recommendations.length > 0 ? (
        <div className='grid gap-6'>
          {recommendations.map((job) => (
            <Card key={job.id} className='border-primary'>
              <div className='absolute right-4 top-4 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground'>
                <Sparkles className='h-3 w-3' />
                <span>{job.relevanceScore}% Match</span>
              </div>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.company_name}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <MapPin className='mr-1 h-4 w-4' />
                  {job.location}
                  <span className='mx-2'>•</span>
                  <BriefcaseBusiness className='mr-1 h-4 w-4' />
                  {job.job_type}
                  {job.salary_min && job.salary_max && (
                    <>
                      <span className='mx-2'>•</span>$
                      {job.salary_min.toLocaleString()} - $
                      {job.salary_max.toLocaleString()}
                    </>
                  )}
                </div>
                <div>
                  <p className='line-clamp-3 text-sm'>{job.description}</p>
                </div>
                <div>
                  <p className='text-sm font-medium mb-1'>
                    Why this is a good match:
                  </p>
                  <p className='text-sm text-muted-foreground'>{job.reasons}</p>
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
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <Sparkles className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium mb-2'>No recommendations yet</h3>
          <p className='text-sm text-muted-foreground mb-4 max-w-md'>
            We couldn't find any job matches for your profile. Try updating your
            CV with more skills and experience.
          </p>
          <Button asChild>
            <Link href='/jobs'>Browse All Jobs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
