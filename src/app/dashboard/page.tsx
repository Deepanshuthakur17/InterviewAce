'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import useSWR from 'swr';
import { UserProfile, HistoryItem } from '@/lib/mockDb';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import {
  Award, Clock, History, AlertTriangle, CheckCircle2, ArrowRight,
  TrendingUp, Play, BookOpen, User, Star, Flame, Sparkles
} from 'lucide-react';

const fetcher = (url: string): Promise<any> => fetch(url).then(r => r.json());

export default function Dashboard() {
  const navigate = useRouter();

  // SWR Hooks
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      navigate.push('/auth');
    },
  });

  const { data: stats, error: statsError, isLoading: statsLoading } = useSWR<any>('/api/stats', fetcher);
  const { data: history, error: historyError, isLoading: historyLoading } = useSWR<HistoryItem[]>('/api/history', fetcher);
  const { data: profile, error: profileError, isLoading: profileLoading } = useSWR<UserProfile>('/api/profile', fetcher);

  const isLoading = statsLoading || historyLoading || profileLoading || status === 'loading';

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <SkeletonLoader variant="dashboard" />
      </div>
    );
  }

  if (statsError || historyError || profileError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Failed to load dashboard data</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Please refresh the page or try logging in again.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30';
    if (score >= 65) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30';
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 65) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-tr from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl dark:border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Placement Readiness Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Keep pushing, {profile?.name || 'Ace'}!
            </h1>
            <p className="max-w-xl text-sm text-indigo-200">
              Your overall AI interview readiness score is at <span className="font-bold text-white">{stats?.averageScore}%</span>. Improve your technical explanations to unlock elite score tiers!
            </p>
          </div>
          <div className="shrink-0 flex gap-3">
            <Link
              href="/library"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-950 hover:bg-slate-50 transition-colors shadow-lg shadow-black/10"
            >
              <Play className="mr-2 h-4 w-4 text-indigo-600 fill-indigo-600" />
              <span>Practice Now</span>
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-500/30 transition-colors"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Update Goals</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Interviews */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <History className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interviews Practiced</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalInterviews}</p>
          </div>
        </div>

        {/* Metric 2: Average Score */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex items-center space-x-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getScoreColor(stats?.averageScore || 0)} border`}>
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Readiness Score</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.averageScore}%</p>
          </div>
        </div>

        {/* Metric 3: Technical Average */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Technical Accuracy</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.technicalAverage}%</p>
          </div>
        </div>

        {/* Metric 4: Total Hours */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Practice Duration</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.totalHours} hrs</p>
          </div>
        </div>
      </div>

      {/* Analytics & Topics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Progress Chart */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Pacing</h3>
              <p className="text-xs text-slate-400">Number of simulated rounds completed per week</p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">
              <Flame className="h-3.5 w-3.5" />
              <span>Practice Streak: 4 Weeks</span>
            </div>
          </div>

          {/* Simple Visual Chart */}
          <div className="flex items-end justify-between h-48 pt-4 px-4 border-b border-slate-100 dark:border-slate-800">
            {stats?.weeklyProgress.map((val: number, i: number) => {
              const heights = ['h-12', 'h-24', 'h-36', 'h-40'];
              const heightClass = heights[i] || 'h-10';
              return (
                <div key={i} className="flex flex-col items-center w-1/5 group">
                  <div className="relative w-full flex justify-center">
                    {/* Tooltip */}
                    <span className="absolute -top-8 bg-indigo-950 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val} rounds
                    </span>
                    <div className={`w-12 bg-linear-to-t from-indigo-500 to-indigo-600 rounded-t-xl group-hover:from-indigo-400 group-hover:to-indigo-500 transition-all shadow-sm ${heightClass}`} />
                  </div>
                  <span className="mt-2 text-xs font-semibold text-slate-400">Week {i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strong vs Weak Topics */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Topic Breakdown</h3>

            {/* Strong Topics */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Strong Areas (Score &ge; 80%)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {stats?.strongTopics.map((topic: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Weak Topics */}
            <div className="space-y-3.5 mt-6">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Focus Areas (Score &lt; 80%)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {stats?.weakTopics.map((topic: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/question-bank"
              className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Review focus questions in Bank</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interview History */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Practice History</h3>
            <p className="text-xs text-slate-400">Review your past performance reports and detailed AI assessments</p>
          </div>
          <Link
            href="/library"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <span>Practice New Role</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {history && history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Role Track</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Questions</th>
                  <th className="pb-3 text-center">AI Score</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 pl-2 font-bold text-slate-850 dark:text-slate-200">{item.roleTitle}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{item.date}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{Math.round(item.durationSpent / 60)} mins</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{item.answeredQuestions} / {item.totalQuestions}</td>
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getScoreColor(item.feedback.overallScore)}`}>
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${getScoreBadgeClass(item.feedback.overallScore)}`} />
                        {item.feedback.overallScore}%
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <button
                        onClick={() => navigate.push(`/feedback/${item.id}`)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      >
                        View AI Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
              <Play className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">No interviews practiced yet</h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Ready to land your dream tech job? Take your first mock interview to get detailed AI analytics and custom feedback!
            </p>
            <Link
              href="/library"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
            >
              <span>Browse Interview Tracks</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};
