'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: number | null;
  createdAt: string;
  user: {
    email: string;
  };
  _count: {
    applications: number;
  };
}

interface Application {
  id: string;
  jobId: string;
  userId: string;
  appliedAt: string;
  job: Job;
}

export default function JobsPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Fetch jobs and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch jobs
        const jobsResponse = await fetch('/api/jobs');
        if (!jobsResponse.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.jobs);

        // Fetch applications if user is logged in
        if (session) {
          const applicationsResponse = await fetch('/api/applications');
          if (applicationsResponse.ok) {
            const applicationsData = await applicationsResponse.json();
            setApplications(applicationsData.applications);
          }
        }
      } catch (err) {
        setError('Error loading data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle job submission
  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentSession?.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      const data = await response.json();

      // Add the new job to the jobs list
      setJobs((prevJobs) => [data.job, ...prevJobs]);

      // Reset form and hide it
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
      });
      setShowAddJobForm(false);

      // Show success notification
      setNotification({
        message: 'Job created successfully!',
        type: 'success',
      });

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setNotification({
        message: 'Failed to create job',
        type: 'error',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Handle job application
  const handleApplyForJob = async (jobId: string) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to apply for job');
      }

      const data = await response.json();

      // Add the new application to the applications list
      setApplications((prevApplications) => [
        data.application,
        ...prevApplications,
      ]);

      // Show success notification
      setNotification({
        message: 'Applied for job successfully!',
        type: 'success',
      });

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setNotification({
        message: err.message || 'Failed to apply for job',
        type: 'error',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Remove the job from the jobs list
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));

      // Show success notification
      setNotification({
        message: 'Job deleted successfully!',
        type: 'success',
      });

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setNotification({
        message: 'Failed to delete job',
        type: 'error',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Check if user has already applied for a job
  const hasApplied = (jobId: string) => {
    return applications.some((application) => application.jobId === jobId);
  };

  // Check if user is the creator of a job
  const isJobCreator = (job: Job) => {
    return session?.user.email === job.user.email;
  };

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Jobs Board</h1>
        {session && (
          <button
            onClick={() => setShowAddJobForm(!showAddJobForm)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
          >
            {showAddJobForm ? 'Cancel' : 'Post a Job'}
          </button>
        )}
      </div>

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

      {/* Add Job Form */}
      {showAddJobForm && (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Post a New Job</h2>
          <form onSubmit={handleSubmitJob}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label htmlFor='title' className='block mb-1 font-medium'>
                  Job Title *
                </label>
                <input
                  type='text'
                  id='title'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700'
                />
              </div>
              <div>
                <label htmlFor='company' className='block mb-1 font-medium'>
                  Company *
                </label>
                <input
                  type='text'
                  id='company'
                  name='company'
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700'
                />
              </div>
              <div>
                <label htmlFor='location' className='block mb-1 font-medium'>
                  Location *
                </label>
                <input
                  type='text'
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700'
                />
              </div>
              <div>
                <label htmlFor='salary' className='block mb-1 font-medium'>
                  Salary (optional)
                </label>
                <input
                  type='number'
                  id='salary'
                  name='salary'
                  value={formData.salary}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700'
                />
              </div>
            </div>
            <div className='mb-4'>
              <label htmlFor='description' className='block mb-1 font-medium'>
                Job Description *
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700'
              ></textarea>
            </div>
            <button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Post Job
            </button>
          </form>
        </div>
      )}

      {/* Jobs List */}
      {loading ? (
        <div className='text-center py-10'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
          <p className='mt-2'>Loading jobs...</p>
        </div>
      ) : error ? (
        <div className='bg-red-100 text-red-800 p-4 rounded-lg'>{error}</div>
      ) : jobs.length === 0 ? (
        <div className='text-center py-10'>
          <p className='text-gray-500 dark:text-gray-400'>
            No jobs found. Be the first to post a job!
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          {jobs.map((job) => (
            <div
              key={job.id}
              className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'
            >
              <div className='flex justify-between items-start'>
                <div>
                  <h2 className='text-xl font-semibold'>{job.title}</h2>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {job.company} • {job.location}
                  </p>
                </div>
                {job.salary && (
                  <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
                    ${job.salary.toLocaleString()}
                  </span>
                )}
              </div>
              <p className='mt-4'>{job.description}</p>
              <div className='mt-6 flex items-center justify-between'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  <span>Posted by {job.user.email}</span>
                  <span className='mx-2'>•</span>
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  <span className='mx-2'>•</span>
                  <span>{job._count.applications} applications</span>
                </div>
                <div className='flex space-x-2'>
                  {session && isJobCreator(job) && (
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors'
                    >
                      Delete
                    </button>
                  )}
                  {session && !isJobCreator(job) && (
                    <button
                      onClick={() => handleApplyForJob(job.id)}
                      disabled={hasApplied(job.id)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        hasApplied(job.id)
                          ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {hasApplied(job.id) ? 'Applied' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
