'use client';

export default function RecentActivity() {
  // Sample activity data - in a real app, this would come from an API
  const activities = [
    {
      id: 1,
      type: 'application',
      title: 'Applied for Senior Frontend Developer at TechCorp Inc.',
      time: '2 hours ago',
      icon: '📝',
    },
    {
      id: 2,
      type: 'view',
      title: 'Viewed Full Stack Engineer at InnovateSoft',
      time: '1 day ago',
      icon: '👁️',
    },
    {
      id: 3,
      type: 'message',
      title: 'Received message from DesignHub recruiter',
      time: '2 days ago',
      icon: '💬',
    },
    {
      id: 4,
      type: 'interview',
      title: 'Scheduled interview with GrowthStartup',
      time: '3 days ago',
      icon: '🗓️',
    },
    {
      id: 5,
      type: 'saved',
      title: 'Saved Product Manager job at TechInnovate',
      time: '5 days ago',
      icon: '🔖',
    },
  ];

  // Function to get color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'view':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case 'message':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'interview':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'saved':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full'>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
            Recent Activity
          </h2>
          <button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
            View All
          </button>
        </div>

        <div className='space-y-4'>
          {activities.map((activity) => (
            <div key={activity.id} className='flex items-start'>
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(
                  activity.type
                )}`}
              >
                {activity.icon}
              </div>
              <div className='ml-3 flex-1'>
                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                  {activity.title}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
