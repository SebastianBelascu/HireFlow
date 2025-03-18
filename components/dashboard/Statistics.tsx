'use client';

export default function Statistics() {
  // Sample statistics data - in a real app, this would come from an API
  const stats = [
    {
      id: 1,
      title: 'Applications',
      value: 24,
      change: '+12%',
      trend: 'up',
      icon: '📝',
    },
    {
      id: 2,
      title: 'Interviews',
      value: 8,
      change: '+33%',
      trend: 'up',
      icon: '🗣️',
    },
    {
      id: 3,
      title: 'Profile Views',
      value: 142,
      change: '+18%',
      trend: 'up',
      icon: '👁️',
    },
    {
      id: 4,
      title: 'Response Rate',
      value: '68%',
      change: '-5%',
      trend: 'down',
      icon: '📊',
    },
  ];

  return (
    <div className='mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-transform duration-300 hover:transform hover:scale-105'
          >
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  {stat.title}
                </p>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
                  {stat.value}
                </h3>
              </div>
              <div className='w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl'>
                {stat.icon}
              </div>
            </div>
            <div className='mt-4 flex items-center'>
              <span
                className={`text-xs font-medium ${
                  stat.trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
              <span className='text-xs text-gray-500 dark:text-gray-400 ml-2'>
                from last month
              </span>
            </div>

            {/* Simple bar chart visualization */}
            <div className='mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
              <div
                className={`h-full ${
                  stat.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: stat.trend === 'up' ? '75%' : '40%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Status Chart */}
      <div className='mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6'>
        <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
          Application Status
        </h3>
        <div className='flex items-center justify-center h-48'>
          {/* Simple chart visualization using divs */}
          <div className='flex items-end h-full w-full max-w-2xl mx-auto space-x-6'>
            <div className='flex-1 flex flex-col items-center'>
              <div
                className='w-full bg-blue-500 rounded-t-lg'
                style={{ height: '60%' }}
              ></div>
              <span className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                Applied
              </span>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                24
              </span>
            </div>
            <div className='flex-1 flex flex-col items-center'>
              <div
                className='w-full bg-yellow-500 rounded-t-lg'
                style={{ height: '30%' }}
              ></div>
              <span className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                In Review
              </span>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                12
              </span>
            </div>
            <div className='flex-1 flex flex-col items-center'>
              <div
                className='w-full bg-purple-500 rounded-t-lg'
                style={{ height: '20%' }}
              ></div>
              <span className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                Interview
              </span>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                8
              </span>
            </div>
            <div className='flex-1 flex flex-col items-center'>
              <div
                className='w-full bg-green-500 rounded-t-lg'
                style={{ height: '10%' }}
              ></div>
              <span className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                Offer
              </span>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                4
              </span>
            </div>
            <div className='flex-1 flex flex-col items-center'>
              <div
                className='w-full bg-red-500 rounded-t-lg'
                style={{ height: '15%' }}
              ></div>
              <span className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                Rejected
              </span>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                6
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
