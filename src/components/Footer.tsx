'use client';
import React from 'react';
import Link from 'next/link';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { BrainCircuit, Mail, CheckCircle } from 'lucide-react';

const NewsletterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
});

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 md:grid-cols-2">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <span className="bg-linear-to-r from-slate-900 to-indigo-950 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-white dark:to-indigo-200">
                Interview<span className="text-indigo-600 dark:text-indigo-400">Ace</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              AI-powered mock interview platform designed to help computer applications and engineering students land their dream tech roles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Features</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/library" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Interview Library
                </Link>
              </li>
              <li>
                <Link href="/question-bank" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Question Bank
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Practice Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Resume Analyzer
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Tracks */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Interview Tracks</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/library" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Frontend & React Dev
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Next.js & TypeScript
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  HR & Behavioral Prep
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  BCA Academic Interviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form using Formik */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Stay Updated</h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Get the latest interview questions and industry tips delivered weekly.
            </p>
            <Formik
              initialValues={{ email: '' }}
              validationSchema={NewsletterSchema}
              onSubmit={(values, { resetForm, setSubmitting, setStatus }) => {
                setTimeout(() => {
                  setStatus({ success: true });
                  setSubmitting(false);
                  resetForm();
                }, 1000);
              }}
            >
              {({ errors, touched, isSubmitting, status }) => (
                <Form className="mt-4">
                  {status?.success ? (
                    <div className="flex items-center space-x-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>Subscribed successfully!</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative rounded-xl shadow-sm">
                        <Field
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          className={`w-full rounded-xl border bg-white py-2.5 pl-3 pr-10 text-sm outline-none transition-all dark:bg-slate-900 ${errors.email && touched.email
                              ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                              : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                            }`}
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                      {errors.email && touched.email && (
                        <p className="text-xs text-rose-500 mt-1 pl-1">{errors.email}</p>
                      )}
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center dark:border-slate-800">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} InterviewAce Inc. Built with React, Tailwind CSS, SWR, and Formik. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
