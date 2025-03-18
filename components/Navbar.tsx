import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='fixed w-full top-0 z-10 backdrop-blur-md py-4 px-6 md:px-12'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <Link href='/' className='text-xl font-bold text-foreground'>
          HireFlow
        </Link>
        <Link
          href='/signup'
          className='rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 font-medium hover:shadow-lg transition-all duration-300 ease-in-out'
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
