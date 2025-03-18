'use client';

import { useState } from 'react';
import Link from 'next/link';

// Dashboard Components
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import JobRecommendations from '@/components/dashboard/JobRecommendations';
import RecentActivity from '@/components/dashboard/RecentActivity';
import Statistics from '@/components/dashboard/Statistics';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='min-h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex'>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        {/* Top Navigation Bar */}
        <TopNavbar toggleSidebar={toggleSidebar} />

        {/* Main Dashboard Content */}
        <main className='flex-1 p-4 md:p-6 overflow-auto'>
          <div className='max-w-7xl mx-auto'>
            <h1 className='text-2xl md:text-3xl font-bold mb-6'>Dashboard</h1>

            {/* Dashboard Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Statistics Section - Spans full width on mobile, 1/3 on desktop */}
              <div className='lg:col-span-3'>
                <Statistics />
              </div>

              {/* Job Recommendations - Spans 2/3 on desktop */}
              <div className='lg:col-span-2'>
                <JobRecommendations />
              </div>

              {/* Recent Activity - Spans 1/3 on desktop */}
              <div className='lg:col-span-1'>
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
