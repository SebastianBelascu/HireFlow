import Link from 'next/link';

export default function Hero() {
  return (
    <section className='flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 md:pt-40 md:pb-32 relative'>
      <div className='absolute inset-0 bg-gradient-to-b from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 -z-10 rounded-3xl mx-6 md:mx-12 lg:mx-24'></div>
      <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300'>
        Streamline Your Hiring Process with Intelligent Automation
      </h1>

      <p className='text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl'>
        HireFlow helps you find, evaluate, and hire the best talent faster with
        our AI-powered recruitment platform. Save time and make better hiring
        decisions.
      </p>

      <Link
        href='/signup'
        className='rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 text-lg font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out'
      >
        Sign Up — It's Free
      </Link>
    </section>
  );
}
