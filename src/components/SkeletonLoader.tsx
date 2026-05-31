import React from 'react';

interface SkeletonProps {
  variant?: 'card' | 'list' | 'dashboard' | 'profile' | 'question';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ variant = 'card', count = 3 }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
              <div 
                key={i} 
                className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="mt-6 flex justify-between">
                  <div className="h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-8 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <div 
                key={i} 
                className="animate-pulse flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        );

      case 'question':
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <div 
                key={i} 
                className="animate-pulse rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="mt-4 h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 flex justify-between">
                  <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i} 
                  className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="mt-2 h-7 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="animate-pulse lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 h-80" />
              <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 h-80" />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="animate-pulse space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col items-center sm:flex-row sm:space-x-6">
                <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 sm:mt-0 flex-1 space-y-3 text-center sm:text-left">
                  <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800 mx-auto sm:mx-0" />
                  <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800 mx-auto sm:mx-0" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="h-60 rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" />
              <div className="h-60 rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return <>{renderSkeleton()}</>;
};
