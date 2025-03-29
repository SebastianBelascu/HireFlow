'use client';

import { useState, useCallback, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import { CVInfo } from '@/lib/models';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: number;
  matchPercentage: number;
  explanation: string;
  logo?: string;
}

interface FeedbackItem {
  jobId: string;
  liked: boolean;
}

export default function CVUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>(
    []
  );
  const [cvInfo, setCvInfo] = useState<CVInfo | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Reset states
    setError(null);
    setIsProcessing(true);
    setRecommendations([]);

    try {
      // Here you would implement the actual CV processing logic
      // For now, we'll simulate the process with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate receiving recommendations
      const mockRecommendations: JobRecommendation[] = [
        {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'Remote',
          description:
            'Looking for an experienced developer with React and TypeScript skills.',
          salary: 120000,
          matchPercentage: 85,
          explanation:
            'Your experience with React and TypeScript matches the job requirements.',
          logo: '/images/tech-corp-logo.svg',
        },
        // Add more mock recommendations as needed
      ];

      setRecommendations(mockRecommendations);
    } catch (err) {
      setError('Failed to process your CV. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    multiple: false,
  });

  return (
    <div className='p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
      <h2 className='text-2xl font-bold mb-6'>Upload Your CV</h2>

      {/* Upload Section */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }
          hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20`}
      >
        <input {...getInputProps()} />
        <div className='space-y-4'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            stroke='currentColor'
            fill='none'
            viewBox='0 0 48 48'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
            />
          </svg>
          <div className='text-lg'>
            {isDragActive ? (
              <p className='text-blue-500'>Drop your CV here</p>
            ) : (
              <p>
                Drag and drop your CV here, or{' '}
                <span className='text-blue-500'>click to select a file</span>
              </p>
            )}
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Supported formats: PDF, DOC, DOCX
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg'>
          {error}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className='mt-6 flex flex-col items-center'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Processing your CV...
          </p>
        </div>
      )}

      {/* CV Information Section */}
      {cvInfo && (
        <div className='mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
          <h3 className='text-xl font-semibold mb-4'>
            Extracted CV Information
          </h3>
          <div className='space-y-4'>
            <div>
              <h4 className='font-medium'>Name</h4>
              <p>{cvInfo.name}</p>
            </div>

            {cvInfo.contact && (
              <div>
                <h4 className='font-medium'>Contact</h4>
                <p>{cvInfo.contact.email}</p>
                <p>{cvInfo.contact.phone}</p>
              </div>
            )}

            {cvInfo.workExperience && cvInfo.workExperience.length > 0 && (
              <div>
                <h4 className='font-medium'>Work Experience</h4>
                <ul className='list-disc pl-5'>
                  {cvInfo.workExperience.map((exp, index) => (
                    <li key={index}>
                      {exp.title} at {exp.company} ({exp.years})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {cvInfo.skills && cvInfo.skills.length > 0 && (
              <div>
                <h4 className='font-medium'>Skills</h4>
                <div className='flex flex-wrap gap-2'>
                  {cvInfo.skills.map((skill, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-full text-sm'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cvInfo.education && cvInfo.education.length > 0 && (
              <div>
                <h4 className='font-medium'>Education</h4>
                <ul className='list-disc pl-5'>
                  {cvInfo.education.map((edu, index) => (
                    <li key={index}>
                      {edu.degree} from {edu.institution} ({edu.year})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className='mt-8'>
          <h3 className='text-xl font-semibold mb-4'>Job Recommendations</h3>
          <div className='grid grid-cols-1 gap-4'>
            {recommendations.map((job) => (
              <div
                key={job.id}
                className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='text-lg font-medium'>{job.title}</h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {job.company} • {job.location}
                    </p>
                    {job.salary && (
                      <p className='text-gray-600 dark:text-gray-400'>
                        Salary: ${job.salary.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
                    {job.matchPercentage}% Match
                  </span>
                </div>

                <div className='mt-3'>
                  <h5 className='font-medium text-sm'>
                    Why this job matches your profile:
                  </h5>
                  <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                    {job.explanation}
                  </p>
                </div>

                <div className='mt-2'>
                  <h5 className='font-medium text-sm'>Job Description:</h5>
                  <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                    {job.description}
                  </p>
                </div>

                <div className='mt-4 flex justify-between items-center'>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() =>
                        setFeedback([
                          ...feedback.filter((f) => f.jobId !== job.id),
                          { jobId: job.id, liked: true },
                        ])
                      }
                      className={`p-2 rounded-full ${
                        feedback.find((f) => f.jobId === job.id && f.liked)
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      👍
                    </button>
                    <button
                      onClick={() =>
                        setFeedback([
                          ...feedback.filter((f) => f.jobId !== job.id),
                          { jobId: job.id, liked: false },
                        ])
                      }
                      className={`p-2 rounded-full ${
                        feedback.find((f) => f.jobId === job.id && !f.liked)
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      👎
                    </button>
                  </div>
                  <button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200'>
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations Message */}
      {!isProcessing && cvInfo && recommendations.length === 0 && (
        <div className='mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg'>
          <h3 className='text-xl font-semibold mb-2'>No Job Matches Found</h3>
          <p className='text-gray-600 dark:text-gray-400'>
            We couldn't find any jobs that match your profile. Consider adding
            more skills or experience to your CV, or check back later for new
            job listings.
          </p>
        </div>
      )}
    </div>
  );
}
