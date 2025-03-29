'use client';

import { useState, useEffect } from 'react';
import { JobRecommendation } from '@/lib/models';

export default function JobRecommendations() {
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch job recommendations from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs');

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        // Add mock match percentages for display purposes
        const jobsWithMatches = data.jobs
          .slice(0, 4)
          .map((job: any, index: number) => ({
            ...job,
            matchPercentage: 95 - index * 5,
            explanation: 'This job matches your skills and experience.',
            logo: ['🏢', '💻', '🎨', '📊'][index % 4],
          }));

        setJobs(jobsWithMatches);
      } catch (err: any) {
        setError(err.message || 'Failed to load job recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden'>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
            Job Recommendations
          </h2>
          <button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
            View All
          </button>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
          </div>
        ) : error ? (
          <div className='p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg'>
            {error}
          </div>
        ) : (
          <div className='space-y-4'>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200'
                >
                  <div className='flex items-start'>
                    <div className='flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-2xl'>
                      {job.logo || '💼'}
                    </div>
                    <div className='ml-4 flex-1'>
                      <div className='flex justify-between'>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                          {job.title}
                        </h3>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
                          {job.matchPercentage}% Match
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {job.company} • {job.location}
                      </p>
                      {job.salary && (
                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                          ${job.salary.toLocaleString()}
                        </p>
                      )}
                      <div className='mt-2 flex justify-between items-center'>
                        <span className='text-xs text-gray-500 dark:text-gray-500'>
                          {job.explanation && (
                            <span title={job.explanation}>AI Matched</span>
                          )}
                        </span>
                        <button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                <p>No job recommendations available.</p>
                <p className='mt-2 text-sm'>
                  Upload your CV to get personalized recommendations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
