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
import { FileText, Pencil } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getAuthSession();

  const profile = await prisma.profile.findUnique({
    where: {
      user_id: session?.user.id,
    },
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>My Profile</h2>
          <p className='text-muted-foreground'>
            Manage your profile information
          </p>
        </div>
        <Button asChild>
          <Link href='/profile/edit'>
            <Pencil className='mr-2 h-4 w-4' />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your personal information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <div className='text-sm font-medium text-muted-foreground'>
                  Name
                </div>
                <div>{session?.user.name || 'Not provided'}</div>
              </div>
              <div>
                <div className='text-sm font-medium text-muted-foreground'>
                  Email
                </div>
                <div>{session?.user.email}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>CV & Resume</CardTitle>
              <CardDescription>
                Your uploaded CV and extracted information
              </CardDescription>
            </div>
            <div className='flex gap-2'>
              {profile?.cv_url && (
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={profile.cv_url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <FileText className='mr-2 h-4 w-4' />
                    Preview CV
                  </a>
                </Button>
              )}
              <Button variant='outline' size='sm' asChild>
                <Link href='/profile/cv'>
                  <FileText className='mr-2 h-4 w-4' />
                  {profile?.cv_url ? 'Update CV' : 'Upload CV'}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {profile?.cv_url ? (
              <>
                <div>
                  <div className='text-sm font-medium text-muted-foreground mb-2'>
                    Skills
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <div
                          key={index}
                          className='rounded-full bg-primary/10 px-3 py-1 text-xs text-primary'
                        >
                          {skill}
                        </div>
                      ))
                    ) : (
                      <div className='text-sm text-muted-foreground'>
                        No skills extracted
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className='text-sm font-medium text-muted-foreground mb-2'>
                    Experience
                  </div>
                  <div className='text-sm'>
                    {profile.experience || 'No experience extracted'}
                  </div>
                </div>
                <div>
                  <div className='text-sm font-medium text-muted-foreground mb-2'>
                    Education
                  </div>
                  <div className='text-sm'>
                    {profile.education || 'No education extracted'}
                  </div>
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <FileText className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>No CV Uploaded</h3>
                <p className='text-sm text-muted-foreground mb-4 max-w-md'>
                  Upload your CV to get personalized job recommendations based
                  on your skills and experience.
                </p>
                <Button asChild>
                  <Link href='/profile/cv'>Upload CV</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
