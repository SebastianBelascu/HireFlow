'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
}

export default function CVUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>(
    []
  );

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
          applyLink: '#',
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

      {/* Processing Indicator */}
      {isProcessing && (
        <div className='mt-6 text-center'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-2 text-gray-600 dark:text-gray-300'>
            Processing your CV...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className='mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg'>
          <p>{error}</p>
        </div>
      )}

      {/* Job Recommendations */}
      {recommendations.length > 0 && (
        <div className='mt-8'>
          <h3 className='text-xl font-semibold mb-4'>Job Recommendations</h3>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-1'>
            {recommendations.map((job) => (
              <div
                key={job.id}
                className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow'
              >
                <h4 className='text-lg font-semibold'>{job.title}</h4>
                <p className='text-gray-600 dark:text-gray-300'>
                  {job.company}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                  {job.location}
                </p>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>
                  {job.description}
                </p>
                <a
                  href={job.applyLink}
                  className='inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
