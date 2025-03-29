'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from './LogoutButton';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  // Navigation items with icons and labels
  const navItems = [
    { icon: '🏠', label: 'Home', href: '/dashboard' },
    { icon: '💼', label: 'Jobs', href: '/dashboard/jobs' },
    { icon: '📝', label: 'My Applications', href: '/dashboard/applications' },
    { icon: '👤', label: 'Profile', href: '/dashboard/profile' },
    { icon: '📊', label: 'Analytics', href: '/dashboard/analytics' },
    { icon: '🔔', label: 'Notifications', href: '/dashboard/notifications' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo and toggle button */}
      <div className='flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700'>
        <Link href='/dashboard' className='flex items-center'>
          {isOpen ? (
            <span className='text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent'>
              HireFlow
            </span>
          ) : (
            <span className='text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent'>
              HF
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className='p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
        >
          {isOpen ? (
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
              />
            </svg>
          ) : (
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 5l7 7-7 7M5 5l7 7-7 7'
              />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className='mt-6 px-3'>
        <ul className='space-y-2'>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  isOpen ? 'justify-start' : 'justify-center'
                }`}
              >
                <span className='text-xl'>{item.icon}</span>
                {isOpen && (
                  <span className='ml-3 font-medium'>{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button at Bottom */}
      <div className='absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700'>
        <LogoutButton isOpen={isOpen} />
      </div>
    </aside>
  );
}
