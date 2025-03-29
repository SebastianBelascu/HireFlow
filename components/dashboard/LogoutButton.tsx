'use client';

import { useAuth } from '@/contexts/AuthContext';

interface LogoutButtonProps {
  isOpen: boolean;
}

export default function LogoutButton({ isOpen }: LogoutButtonProps) {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors duration-200 w-full ${
        isOpen ? 'justify-start' : 'justify-center'
      }`}
    >
      <span className='text-xl'>🚪</span>
      {isOpen && <span className='ml-3 font-medium'>Logout</span>}
    </button>
  );
}
