'use client';

export default function JobRecommendations() {
  // Sample job data - in a real app, this would come from an API
  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      matchPercentage: 95,
      posted: '2 days ago',
      logo: '🏢',
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'InnovateSoft',
      location: 'Remote',
      salary: '$100,000 - $130,000',
      matchPercentage: 88,
      posted: '1 week ago',
      logo: '💻',
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'New York, NY',
      salary: '$90,000 - $110,000',
      matchPercentage: 82,
      posted: '3 days ago',
      logo: '🎨',
    },
    {
      id: 4,
      title: 'Product Manager',
      company: 'GrowthStartup',
      location: 'Austin, TX',
      salary: '$110,000 - $140,000',
      matchPercentage: 79,
      posted: '5 days ago',
      logo: '📊',
    },
  ];

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

        <div className='space-y-4'>
          {jobs.map((job) => (
            <div
              key={job.id}
              className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200'
            >
              <div className='flex items-start'>
                <div className='flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-2xl'>
                  {job.logo}
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
                  <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                    {job.salary}
                  </p>
                  <div className='mt-2 flex justify-between items-center'>
                    <span className='text-xs text-gray-500 dark:text-gray-500'>
                      Posted {job.posted}
                    </span>
                    <button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
