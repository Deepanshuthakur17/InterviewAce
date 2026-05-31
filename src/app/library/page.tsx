'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import useSWR, { useSWRConfig } from 'swr';
import { mockDb, InterviewRole } from '@/lib/mockDb';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { 
  Search, Filter, Star, Clock, HelpCircle, ArrowRight, Award,
  Layout, Atom, Layers, Braces, ShieldCheck, Users, GraduationCap, Sparkles
} from 'lucide-react';

const fetcher = (url: string): Promise<any> => mockDb.get(url);

const iconMap: Record<string, any> = {
  Layout,
  Atom,
  Layers,
  Braces,
  ShieldCheck,
  Users,
  GraduationCap
};

export default function InterviewLibrary() {
  const navigate = useRouter();
  const { mutate } = useSWRConfig();

  // SWR Hooks
  const { data: library, isLoading: libraryLoading } = useSWR<InterviewRole[]>('/api/library', fetcher);
  const { data: favorites, isLoading: favoritesLoading } = useSWR<string[]>('/api/favorites', fetcher);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const isLoading = libraryLoading || favoritesLoading;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <SkeletonLoader variant="card" count={6} />
      </div>
    );
  }

  // Extract unique categories for filters
  const categories = ['All', ...Array.from(new Set(library?.map((role: InterviewRole) => role.category) || []))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Toggle favorite
  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    mockDb.toggleFavorite(id);
    mutate('/api/favorites'); // Re-fetch favorites
  };

  // Filter library items
  const filteredLibrary = library?.filter((role: InterviewRole) => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || role.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30';
      case 'Medium': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-100 dark:border-amber-900/30';
      case 'Hard': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border-rose-100 dark:border-rose-900/30';
      default: return 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Interview Library
        </h1>
        <p className="max-w-2xl text-base text-slate-500 dark:text-slate-400">
          Select a role track to launch a timed, realistic mock interview session. Receive instant, multi-dimensional AI scoring upon completion.
        </p>
      </div>

      {/* Controls: Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm transition-all">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles (e.g. React, HR, BCA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all dark:border-slate-800 dark:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-850 dark:text-slate-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold outline-none dark:border-slate-800 dark:bg-slate-950 text-slate-700 dark:text-slate-300"
            >
              {categories.map((cat: string, i: number) => (
                <option key={i} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold outline-none dark:border-slate-800 dark:bg-slate-950 text-slate-700 dark:text-slate-300"
          >
            {difficulties.map((diff: string, i: number) => (
              <option key={i} value={diff}>{diff === 'All' ? 'All Difficulties' : `${diff} Difficulty`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Roles */}
      {filteredLibrary && filteredLibrary.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLibrary.map((role: InterviewRole) => {
            const IconComponent = iconMap[role.icon] || GraduationCap;
            const isFavorited = favorites?.includes(role.id);

            return (
              <div
                key={role.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900 transition-all duration-300"
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => handleToggleFavorite(e, role.id)}
                  className="absolute top-5 right-5 rounded-lg p-2 text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle favorite"
                >
                  <Star 
                    className={`h-5 w-5 transition-all ${
                      isFavorited 
                        ? 'fill-amber-400 text-amber-400 scale-110' 
                        : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                    }`} 
                  />
                </button>

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center space-x-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-white transition-all duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        {role.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                        {role.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {role.description}
                  </p>

                  {/* Badges/Details */}
                  <div className="mt-6 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center space-x-1 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{role.duration} mins</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{role.questionCount} Qs</span>
                    </span>
                    <span className={`inline-flex items-center rounded-xl border px-2.5 py-1 font-semibold ${getDifficultyColor(role.difficulty)}`}>
                      <Award className="h-3.5 w-3.5 shrink-0 mr-1" />
                      <span>{role.difficulty}</span>
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    onClick={() => navigate.push(`/interview-session/${role.id}`)}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 hover:shadow-indigo-500/10 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all duration-200"
                  >
                    <span>Launch Practice</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tracks match your filters</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search terms or clearing the category and difficulty filters to view all available interview tracks.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
