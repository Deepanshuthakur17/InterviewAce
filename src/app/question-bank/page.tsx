'use client';
import React, { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { mockDb, Question } from '@/lib/mockDb';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { 
  Search, Filter, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, 
  HelpCircle, Award, CheckCircle2, Sparkles, BookOpen, AlertTriangle
} from 'lucide-react';

const fetcher = (url: string): Promise<any> => mockDb.get(url);

export default function QuestionBankPage() {
  const { mutate } = useSWRConfig();

  // SWR Hooks
  const { data: questions, error, isLoading } = useSWR<Question[]>('/api/question-bank', fetcher);
  const { data: bookmarks, isLoading: bookmarksLoading } = useSWR<string[]>('/api/bookmarks', fetcher);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [expandedQs, setExpandedQs] = useState<Record<string, boolean>>({});

  const isDataLoading = isLoading || bookmarksLoading;

  if (isDataLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <SkeletonLoader variant="question" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 mb-4">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Failed to load Question Bank</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">There was an issue fetching the question vault. Please refresh the page.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Categories & Difficulties list
  const categories = ['All', 'Frontend', 'React', 'Next.js', 'JavaScript', 'TypeScript', 'HR', 'BCA'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const toggleBookmark = (id: string) => {
    mockDb.toggleBookmark(id);
    mutate('/api/bookmarks'); // Trigger SWR refresh
  };

  const toggleExpand = (id: string) => {
    setExpandedQs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter questions
  const filteredQuestions = questions?.filter((q: Question) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.idealAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Map category ids/names to match category selection filter
    const matchesCategory = selectedCategory === 'All' || 
                            q.categoryName.toLowerCase() === selectedCategory.toLowerCase() ||
                            (selectedCategory === 'BCA' && q.categoryId === 'bca') ||
                            (selectedCategory === 'HR' && q.categoryId === 'hr');
                            
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Question Bank
        </h1>
        <p className="max-w-2xl text-base text-slate-500 dark:text-slate-400">
          Browse our comprehensive vault of {questions?.length || 35} vetted questions. Study ideal answers, review fundamental concepts, and bookmark questions for active practice.
        </p>
      </div>

      {/* Controls: Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search key terms, answers, or concepts..."
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
              {categories.map((cat, i) => (
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
            {difficulties.map((diff, i) => (
              <option key={i} value={diff}>{diff === 'All' ? 'All Difficulties' : `${diff} Difficulty`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions && filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          {filteredQuestions.map((q: Question) => {
            const isBookmarked = bookmarks?.includes(q.id) || false;
            const isExpanded = expandedQs[q.id] || false;

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900 overflow-hidden transition-all duration-200"
              >
                {/* Question Row */}
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center rounded-xl bg-indigo-50/60 border border-indigo-100/30 px-2.5 py-0.5 font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                        {q.categoryName}
                      </span>
                      <span className={`inline-flex items-center rounded-xl border px-2.5 py-0.5 font-semibold ${getDifficultyColor(q.difficulty)}`}>
                        <Award className="h-3 w-3 mr-1" />
                        {q.difficulty}
                      </span>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  {/* Bookmark Button */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className="rounded-lg p-2 text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Bookmark question"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-5.5 w-5.5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Bookmark className="h-5.5 w-5.5 text-slate-300 hover:text-indigo-600 dark:text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Answer Selector */}
                <div className="border-t border-slate-100 dark:border-slate-850">
                  <button
                    onClick={() => toggleExpand(q.id)}
                    className="flex w-full items-center justify-between px-5 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50/50 dark:text-slate-400 dark:hover:bg-slate-900/50 transition-colors focus:outline-none"
                  >
                    <span className="flex items-center space-x-1.5">
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      <span>{isExpanded ? 'Hide Study Materials' : 'Reveal Ideal Answer & Concept Explanation'}</span>
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {isExpanded && (
                    <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850 space-y-4 text-sm leading-relaxed">
                      {/* Ideal Answer */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span>Ideal Recruiter Response:</span>
                        </span>
                        <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-850 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300">
                          {q.idealAnswer}
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <Sparkles className="h-4 w-4 text-indigo-500" />
                          <span>Key Concept Explanation:</span>
                        </span>
                        <div className="rounded-xl border border-dashed border-indigo-100 bg-indigo-50/5 p-4 dark:border-indigo-950/20 dark:bg-indigo-950/5 text-slate-600 dark:text-indigo-200">
                          {q.explanation}
                        </div>
                      </div>

                      {/* Keywords */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Industry Keywords:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {q.idealKeywords.map((kw, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No questions match your parameters</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search terms or changing filters to view other questions in the bank.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
          >
            Reset Vault Filters
          </button>
        </div>
      )}

    </div>
  );
};
