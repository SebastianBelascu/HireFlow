'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: number | null;
  createdAt: string;
}

interface Application {
  id: string;
  jobId: string;
  userId: string;
  appliedAt: string;
  job: Job;
}

export default function ApplicationsPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (!session) {
        router.push('/signup');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/applications');

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        setApplications(data.applications);
      } catch (err) {
        console.error(err);
        setError('Error loading applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session, router]);

  // Handle application withdrawal
  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw application');
      }

      // Remove the application from the list
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.id !== applicationId)
      );

      // Show success notification
      setNotification({
        message: 'Application withdrawn successfully!',
        type: 'success',
      });

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setNotification({
        message: 'Failed to withdraw application',
        type: 'error',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>My Applications</h1>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <div className='text-center py-10'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
          <p className='mt-2'>Loading applications...</p>
        </div>
      ) : error ? (
        <div className='bg-red-100 text-red-800 p-4 rounded-lg'>{error}</div>
      ) : applications.length === 0 ? (
        <div className='text-center py-10'>
          <p className='text-gray-500 dark:text-gray-400'>
            You haven't applied to any jobs yet.
          </p>
          <button
            onClick={() => router.push('/dashboard/jobs')}
            className='mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          {applications.map((application) => (
            <div
              key={application.id}
              className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'
            >
              <div className='flex justify-between items-start'>
                <div>
                  <h2 className='text-xl font-semibold'>
                    {application.job.title}
                  </h2>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {application.job.company} • {application.job.location}
                  </p>
                </div>
                {application.job.salary && (
                  <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
                    ${application.job.salary.toLocaleString()}
                  </span>
                )}
              </div>
              <p className='mt-4'>{application.job.description}</p>
              <div className='mt-6 flex items-center justify-between'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  <span>
                    Applied on{' '}
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleWithdrawApplication(application.id)}
                  className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors'
                >
                  Withdraw Application
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
