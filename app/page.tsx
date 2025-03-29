import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className='min-h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950'>
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
