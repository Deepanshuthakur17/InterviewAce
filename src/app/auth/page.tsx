'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/components/AuthContext';
import { Logo } from '@/components/Logo';
import {
  Mail, Lock, User, Sparkles, AlertCircle, CheckCircle2, Eye, EyeOff
} from 'lucide-react';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name is too short').required('Full Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

import { Suspense } from 'react';

function AuthContent() {
  const { user, login, signup, googleLogin } = useAuth();
  const searchParams = useSearchParams();
  const navigate = useRouter();

  const activeTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      navigate.push('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      if (errorParam === 'OAuthCallback') {
        setError('Google authentication failed. This is typically caused by invalid or mismatched Google Client credentials.');
      } else {
        setError(errorParam);
      }
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'login' | 'signup') => {
    navigate.push(`/auth?tab=${tab}`);
    setError(null);
    setSuccess(null);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await googleLogin();
      setSuccess('Successfully signed in with Google!');
      setTimeout(() => navigate.push('/dashboard'), 800);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Gradients */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Logo className="mx-auto h-12 w-12 transition-transform hover:scale-105" />
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeTab === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {activeTab === 'login'
              ? 'Sign in to resume your mock interview practice.'
              : 'Join InterviewAce and start mastering tech interviews today.'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900 transition-all">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-950 mb-6">
            <button
              onClick={() => handleTabChange('login')}
              className={`rounded-lg py-2 text-sm font-semibold transition-all ${activeTab === 'login'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`rounded-lg py-2 text-sm font-semibold transition-all ${activeTab === 'signup'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-center space-x-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 mb-4">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 mb-4">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Formik Forms */}
          {activeTab === 'login' ? (
            <Formik
              key="login-form"
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setError(null);
                  await login(values.email, values.password);
                  setSuccess('Successfully logged in!');
                  setTimeout(() => navigate.push('/dashboard'), 800);
                } catch (err: any) {
                  setError(err.message || 'Login failed. Check details.');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="deepanshuthakur172006@gmail.com"
                        className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all dark:bg-slate-950 ${errors.email && touched.email
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                          }`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-xs text-rose-500 mt-1 pl-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Field
                        type={showLoginPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm outline-none transition-all dark:bg-slate-950 ${errors.password && touched.password
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                          }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                        >
                          {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-xs text-rose-500 mt-1 pl-1">{errors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-500 hover:shadow-indigo-500/20 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              key="signup-form"
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={SignupSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setError(null);
                  await signup(values.name, values.email, values.password);
                  setSuccess('Account created successfully!');
                  setTimeout(() => navigate.push('/dashboard'), 800);
                } catch (err: any) {
                  setError(err.message || 'Registration failed.');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <User className="h-5 w-5" />
                      </div>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Deepanshu Thakur"
                        className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all dark:bg-slate-950 ${errors.name && touched.name
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                          }`}
                      />
                    </div>
                    {errors.name && touched.name && (
                      <p className="text-xs text-rose-500 mt-1 pl-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="deepanshuthakur172006@gmail.com"
                        className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all dark:bg-slate-950 ${errors.email && touched.email
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                          }`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-xs text-rose-500 mt-1 pl-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Field
                        type={showSignupPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm outline-none transition-all dark:bg-slate-950 ${errors.password && touched.password
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                          }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                        >
                          {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-xs text-rose-500 mt-1 pl-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Confirm Password</label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••••"
                        className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm outline-none transition-all dark:bg-slate-950 ${errors.confirmPassword && touched.confirmPassword
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                          }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-xs text-rose-500 mt-1 pl-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-500 hover:shadow-indigo-500/20 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating account...' : 'Sign Up'}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 dark:bg-slate-900">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center space-x-2.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.45 1.77 14.93 1 12 1 7.35 1 3.37 3.65 1.39 7.53l3.78 2.93c.88-2.64 3.35-4.42 6.83-4.42z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.08 2.71-2.33 3.55l3.62 2.81c2.12-1.95 3.76-4.83 3.76-8.47z"
              />
              <path
                fill="#FBBC05"
                d="M5.17 10.46c-.22-.66-.35-1.37-.35-2.11s.13-1.45.35-2.11L1.39 7.31C.5 9.07 0 11.02 0 13.1s.5 3.93 1.39 5.69l3.78-2.93c-.22-.66-.35-1.37-.35-2.11z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.62-2.81c-1.1.74-2.51 1.18-4.34 1.18-3.48 0-5.95-1.78-6.83-4.42l-3.78 2.93C3.37 20.35 7.35 23 12 23z"
              />
            </svg>
            <span className="uppercase">continue with google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <AuthContent />
    </Suspense>
  );
}
