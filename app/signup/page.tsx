'use client';

import { useState } from 'react';
import { signUp, signIn } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('signup');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signInErrors, setSignInErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (signInErrors[name]) {
      setSignInErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateSignUpForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignInForm = () => {
    const newErrors: Record<string, string> = {};

    if (!signInData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!signInData.password) {
      newErrors.password = 'Password is required';
    }

    setSignInErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignUpForm()) {
      setIsSubmitting(true);
      try {
        await signUp(formData.email, formData.password);
        setActiveTab('signin');
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          submit: err.message || 'Failed to sign up',
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignInForm()) {
      setIsSubmitting(true);
      try {
        await signIn(signInData.email, signInData.password);
        router.push('/dashboard');
      } catch (err: any) {
        setSignInErrors((prev) => ({
          ...prev,
          submit: err.message || 'Failed to sign in',
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className='min-h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden'>
        <div className='flex border-b border-gray-200 dark:border-gray-700'>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-300 ${
              activeTab === 'signup'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-300 ${
              activeTab === 'signin'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Sign In
          </button>
        </div>

        <div className='p-6 sm:p-8'>
          {activeTab === 'signup' ? (
            <>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Create your account
              </h2>
              <form onSubmit={handleSignUpSubmit}>
                <div className='mb-4'>
                  <label
                    htmlFor='fullName'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='fullName'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.fullName
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300`}
                    placeholder='John Doe'
                  />
                  {errors.fullName && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Email Address
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300`}
                    placeholder='you@example.com'
                  />
                  {errors.email && (
                    <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
                  )}
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.password
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300`}
                    placeholder='••••••••'
                  />
                  {errors.password && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className='mb-6'>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Confirm Password
                  </label>
                  <input
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.confirmPassword
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300`}
                    placeholder='••••••••'
                  />
                  {errors.confirmPassword && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none'
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <p className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
                Already have an account?{' '}
                <button
                  onClick={() => setActiveTab('signin')}
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-300'
                >
                  Sign in
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Welcome back
              </h2>
              <form onSubmit={handleSignInSubmit}>
                <div className='mb-4'>
                  <label
                    htmlFor='signinEmail'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Email Address
                  </label>
                  <input
                    type='email'
                    id='signinEmail'
                    name='email'
                    value={signInData.email}
                    onChange={handleSignInChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      signInErrors.email
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300`}
                    placeholder='you@example.com'
                  />
                  {signInErrors.email && (
                    <p className='mt-1 text-sm text-red-500'>
                      {signInErrors.email}
                    </p>
                  )}
                </div>

                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <label
                      htmlFor='signinPassword'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Password
                    </label>
                    <Link
                      href='/forgot-password'
                      className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300'
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type='password'
                    id='signinPassword'
                    name='password'
                    value={signInData.password}
                    onChange={handleSignInChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      signInErrors.password
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300`}
                    placeholder='••••••••'
                  />
                  {signInErrors.password && (
                    <p className='mt-1 text-sm text-red-500'>
                      {signInErrors.password}
                    </p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none'
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <p className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
                Need an account?{' '}
                <button
                  onClick={() => setActiveTab('signup')}
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-300'
                >
                  Sign up
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
