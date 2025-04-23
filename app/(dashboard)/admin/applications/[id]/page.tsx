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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define the Application interface with snake_case field names to match the database schema
interface Application {
  id: string;
  status: string;
  created_at: string;
  job: {
    id: string;
    title: string;
    company_name: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function ApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  // For client components, we can use params.id directly for now
  // Next.js will eventually require React.use(), but for now this is supported
  const applicationId = params.id;

  const [application, setApplication] = useState<Application | null>(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch application');
        }

        const data = await response.json();
        
        // Map camelCase API response to snake_case for our component
        const mappedApplication: Application = {
          id: data.application.id,
          status: data.application.status,
          created_at: data.application.created_at || data.application.createdAt,
          job: {
            id: data.application.job.id,
            title: data.application.job.title,
            company_name: data.application.job.company_name || data.application.job.companyName,
          },
          user: {
            id: data.application.user.id,
            name: data.application.user.name,
            email: data.application.user.email,
          }
        };
        
        setApplication(mappedApplication);
        setStatus(data.application.status);

        // Fetch user profile
        const profileResponse = await fetch(
          `/api/profile/${data.application.user.id}`
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData.profile);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch application details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, toast]);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      toast({
        title: 'Status updated',
        description: 'Application status has been updated successfully',
      });

      router.refresh();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
          <p className='mt-2'>Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-xl font-bold'>Application not found</h2>
          <p className='text-muted-foreground mt-2'>
            The application you are looking for does not exist or you do not
            have permission to view it.
          </p>
          <Button
            className='mt-4'
            onClick={() => router.push('/admin/applications')}
          >
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <Button
            variant='ghost'
            className='mb-2 p-0 text-muted-foreground'
            onClick={() => router.back()}
          >
            ← Back
          </Button>
          <h2 className='text-2xl font-bold tracking-tight'>
            Application for {application.job.title}
          </h2>
          <p className='text-muted-foreground'>{application.job.company_name}</p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Applicant Profile</CardTitle>
              <CardDescription>
                Information extracted from the applicant&apos;s CV
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='text-lg font-medium mb-2'>Skills</h3>
                <div className='flex flex-wrap gap-2'>
                  {profile?.skills?.length > 0 ? (
                    profile.skills.map((skill: string, index: number) => (
                      <div
                        key={index}
                        className='rounded-full bg-primary/10 px-3 py-1 text-sm text-primary'
                      >
                        {skill}
                      </div>
                    ))
                  ) : (
                    <p className='text-muted-foreground'>No skills found</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className='text-lg font-medium mb-2'>Experience</h3>
                <p className='text-muted-foreground'>
                  {profile?.experience || 'No experience information available'}
                </p>
              </div>
              <div>
                <h3 className='text-lg font-medium mb-2'>Education</h3>
                <p className='text-muted-foreground'>
                  {profile?.education || 'No education information available'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
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
                  {application.created_at && formatDistanceToNow(parseISO(application.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Current Status
                </p>
                <div
                  className={`mt-1 inline-block px-2 py-1 rounded-full text-xs ${
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>
                Change the status of this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='PENDING'>Pending</SelectItem>
                  <SelectItem value='REVIEWED'>Reviewed</SelectItem>
                  <SelectItem value='ACCEPTED'>Accepted</SelectItem>
                  <SelectItem value='REJECTED'>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdateStatus}
                disabled={isUpdating || status === application.status}
                className='w-full'
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
