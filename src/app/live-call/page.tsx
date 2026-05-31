import React from 'react';
import Link from 'next/link';
import { Video, Mic, ArrowRight, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

export default function LiveCallPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="w-full max-w-3xl relative z-10 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30">
          <Sparkles className="h-4 w-4" />
          <span>Coming Soon</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
          Real-time <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-500">Live Mock Interviews</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Practice face-to-face with our advanced Voice & Video AI. Experience the pressure of a real technical interview with real-time feedback, behavioral analysis, and technical grilling.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
              <PhoneCall className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Voice & Video</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Simulate Zoom, Google Meet, or MS Teams environments.</p>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 mb-4">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Transcription</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Real-time STT engine to analyze your communication patterns.</p>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Stress Testing</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">AI dynamically adjusts question difficulty based on your answers.</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button disabled className="inline-flex items-center justify-center rounded-xl bg-slate-300 px-6 py-3.5 text-base font-semibold text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500">
            <Video className="mr-2 h-5 w-5" />
            <span>Join Waitlist</span>
          </button>
          <Link
            href="/library"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
          >
            <span>Practice Text Interviews</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
