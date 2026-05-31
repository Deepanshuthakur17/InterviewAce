'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

import useSWR, { useSWRConfig } from 'swr';
import { mockDb, AnswerRecord, InterviewRole } from '@/lib/mockDb';
import { useAuth } from '@/components/AuthContext';
import {
  Clock, Bookmark, BookmarkCheck, ArrowRight, ArrowLeft, SkipForward,
  Mic, MicOff, AlertCircle, Sparkles, BrainCircuit, CheckSquare, RefreshCw
} from 'lucide-react';

const fetcher = (url: string): Promise<any> => mockDb.get(url);

export default function InterviewSessionPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useRouter();
  const { user } = useAuth();
  const { mutate } = useSWRConfig();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate.push('/auth?tab=login');
    }
  }, [user, navigate]);

  // SWR Hooks
  const { data: role, error, isLoading } = useSWR<InterviewRole>(roleId ? `/api/role/${roleId}` : null, fetcher);
  const { data: bookmarks } = useSWR<string[]>('/api/bookmarks', fetcher);

  // States
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({}); // per question in seconds

  // Timer States
  const [timeLeft, setTimeLeft] = useState(0); // overall time left in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitSubmitStep] = useState(0);

  // Voice Simulation States
  const [isListening, setIsListening] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);
  const listeningTimeoutRef = useRef<any>(null);

  // Initialize timers when role loads
  useEffect(() => {
    if (role) {
      setTimeLeft(role.duration * 60);

      // Initialize states for questions
      const initialAnswers: Record<string, string> = {};
      const initialSkipped: Record<string, boolean> = {};
      const initialBookmarked: Record<string, boolean> = {};
      const initialTimeSpent: Record<string, number> = {};

      role.questions.forEach((q) => {
        initialAnswers[q.id] = '';
        initialSkipped[q.id] = false;
        initialBookmarked[q.id] = bookmarks?.includes(q.id) || false;
        initialTimeSpent[q.id] = 0;
      });

      setAnswers(initialAnswers);
      setSkipped(initialSkipped);
      setBookmarked(initialBookmarked);
      setTimeSpent(initialTimeSpent);
    }
  }, [role, bookmarks]);

  // Main countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || !role || isSubmitting) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(); // Auto-submit when timer expires
          return 0;
        }
        return prev - 1;
      });

      // Increment time spent on current question
      const currentQ = role.questions[currentIdx];
      if (currentQ) {
        setTimeSpent((prev) => ({
          ...prev,
          [currentQ.id]: (prev[currentQ.id] || 0) + 1
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, role, currentIdx, isSubmitting]);

  // Simulated Speech-to-Text
  const toggleListening = () => {
    if (isListening) {
      // Turn off
      setIsListening(false);
      if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
    } else {
      // Turn on
      setIsListening(true);

      // Animate waveform
      const interval = setInterval(() => {
        setWaveform(Array.from({ length: 15 }, () => Math.floor(Math.random() * 24) + 4));
      }, 100);

      // Simulate capturing voice and typing it out
      const currentQ = role?.questions[currentIdx];
      listeningTimeoutRef.current = setTimeout(() => {
        clearInterval(interval);
        setIsListening(false);

        if (currentQ) {
          // Generate a realistic high-quality answer based on question keywords to help student test the system
          const simulatedVoiceAnswers: Record<string, string> = {
            'fe-1': 'Semantic HTML is really important because it uses tags like header, article, and section instead of just divs. This helps screen readers for accessibility and also helps search engines index the page properly for SEO.',
            'fe-2': 'Event delegation works by attaching a single event listener to a parent element instead of multiple listeners on the child elements. It utilizes event bubbling to catch events as they propagate up the DOM.',
            'fe-3': 'Flexbox is mainly one-dimensional, meaning it aligns elements in either a single row or column. Grid is two-dimensional, dealing with rows and columns together, which is better for overall page layouts.',
            'fe-4': 'Core Web Vitals include metrics like LCP for loading, FID or INP for interactivity, and CLS for visual layout shifts. You can optimize them by compressing images, splitting JS code, and setting sizes on assets.',
            'fe-5': 'REST APIs use multiple endpoints for resources, whereas GraphQL uses a single endpoint with queries. This lets clients ask for exactly what they need, avoiding over-fetching and under-fetching.',
            're-1': 'React Hooks must be called at the top level of the function component and only from React functional components or custom hooks. Never call them inside loops or conditional blocks.',
            're-2': 'The Virtual DOM is an in-memory representation of the actual DOM. React uses a diffing algorithm during reconciliation to compare trees and apply only the minimum necessary updates to the real DOM.',
            're-3': 'We can optimize React rendering by using React.memo to prevent component re-renders, and using useMemo and useCallback to cache values and callback functions across renders.',
            're-4': 'Context API is built-in and great for low-frequency global state like themes. Redux or Zustand are external state managers designed for complex, high-frequency updates with selector-based subscriptions.',
            're-5': 'Controlled components have their value managed by React state using useState and onChange, while uncontrolled components use the standard DOM nodes which we access using a useRef hook.',
            'next-1': 'RSCs render on the server, which reduces bundle size and improves loading speed and SEO. Client components are hydrated in the browser, allowing hooks and interactivity with the use client directive.',
            'next-2': 'SSG builds pages statically at build time. SSR renders HTML dynamically on every request. ISR lets you regenerate static pages in the background after a specified duration using revalidate.',
            'next-3': 'Server Actions are async server-side functions called directly from React components. They eliminate writing custom API routes and secure forms by running strictly on the backend with CSRF protection.',
            'next-4': 'Middleware runs on the edge before a request completes. It is used to intercept requests, verify cookies for authentication, and execute rewrites or redirects efficiently.',
            'next-5': 'Optimize images using the next/image component which resizes and lazy loads. Optimize fonts with next/font, which downloads Google Fonts at build time to prevent Cumulative Layout Shift.',
            'js-1': 'A closure is when a function remembers its lexical scope even when it is executed outside of that scope, allowing inner functions to access variables from their parent function after it returns.',
            'js-2': 'The event loop checks if the call stack is empty. Async callbacks from setTimeout go to the task queue, while Promises go to the microtask queue, which has higher priority and executes first.',
            'js-3': 'Double equals performs type coercion to compare values, while triple equals compares both value and type without coercion, which is much safer and prevents bugs.',
            'js-4': 'Promises represent future results of async tasks, avoiding callback hell. Async/await is syntactic sugar written on top of promises to make asynchronous code look synchronous and readable.',
            'js-5': 'Prototypal inheritance means objects inherit properties and methods from other objects via a prototype chain. When a property isn\'t found, JS climbs the chain to search the linked prototypes.',
            'hr-1': 'I am currently a computer applications student focused on frontend web technologies. In the past, I built several responsive React web projects. In the future, I want to specialize in high-performance apps.',
            'hr-2': 'My greatest strength is analytical problem-solving and rapid learning. My weakness is public speaking, but I am actively improving by taking courses and presenting in mock sessions.',
            'hr-3': 'I had a conflict about a design direction with a peer. I used the STAR method: invited them to discuss privately, focused on facts rather than emotions, compromised, and we finished the project successfully.',
            'hr-4': 'I want to join because I deeply admire your mission of building accessible tools. My skills in React and Tailwind align perfectly with your team, and I want to contribute to your growth.',
            'hr-5': 'In 5 years, I see myself as a senior frontend engineer, mastering technical architecture, mentoring junior developers, and leading high-impact web product releases within your company.',
            'bca-1': 'The four pillars of OOP are encapsulation for hiding data, inheritance for reusability, polymorphism for many forms, and abstraction for hiding complex implementation details.',
            'bca-2': 'SQL is relational, uses tables with strict schemas, and scales vertically. NoSQL is non-relational, stores documents with flexible schemas, and scales horizontally.',
            'bca-3': 'SDLC phases include requirements gathering, system design, coding/development, testing, deployment to production, and long-term maintenance.',
            'bca-4': 'DNS translates domain names like google.com into IP addresses. It queries root, TLD, and authoritative nameservers to resolve the IP, then caches it.',
            'bca-5': 'A process is an isolated program in execution with its own memory. A thread is a lightweight execution pathway inside a process that shares resources.'
          };

          const simulatedText = simulatedVoiceAnswers[currentQ.id] ||
            "This is my spoken answer. I am explaining my thoughts clearly, focusing on technical accuracy and structured communication to impress the recruiter.";

          setAnswers((prev) => ({
            ...prev,
            [currentQ.id]: simulatedText
          }));
        }
      }, 5000);
    }
  };

  const handleAnswerChange = (val: string) => {
    if (!role) return;
    const currentQ = role.questions[currentIdx];
    if (currentQ) {
      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: val
      }));
      setSkipped((prev) => ({
        ...prev,
        [currentQ.id]: false // Unskip if typed
      }));
    }
  };

  const handleSkip = () => {
    if (!role) return;
    const currentQ = role.questions[currentIdx];
    if (currentQ) {
      setSkipped((prev) => ({
        ...prev,
        [currentQ.id]: true
      }));
      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: '' // Clear answer on skip
      }));
      handleNext();
    }
  };

  const handleBookmark = () => {
    if (!role) return;
    const currentQ = role.questions[currentIdx];
    if (currentQ) {
      mockDb.toggleBookmark(currentQ.id);
      setBookmarked((prev) => ({
        ...prev,
        [currentQ.id]: !prev[currentQ.id]
      }));
      mutate('/api/bookmarks');
    }
  };

  const handleNext = () => {
    if (!role) return;
    if (currentIdx < role.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // Submit and run simulated AI Analyzer
  const handleSubmit = async () => {
    if (!role) return;
    setIsSubmitting(true);

    // AI Analysis Loading Steps
    const steps = [
      'Evaluating technical accuracy and keyword density...',
      'Analyzing communication clarity and structural flow...',
      'Assessing confidence indicators and pacing metrics...',
      'Compiling custom improvement suggestions and report...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setSubmitSubmitStep(i);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    // Format answers into AnswersRecord
    const records: AnswerRecord[] = role.questions.map((q) => ({
      questionId: q.id,
      questionText: q.question,
      answerText: answers[q.id] || '',
      timeSpent: timeSpent[q.id] || 0,
      isBookmarked: bookmarked[q.id] || false,
      isSkipped: skipped[q.id] || (!answers[q.id] && skipped[q.id]),
    }));

    const totalDurationSeconds = role.duration * 60 - timeLeft;

    // Call AI analyzer in DB
    const result = mockDb.generateFeedback(role.id, records, totalDurationSeconds);

    // Mutate SWR stats & history keys
    mutate('/api/stats');
    mutate('/api/history');

    // Redirect to feedback page
    navigate.push(`/feedback/${result.id}`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 animate-spin items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
          <RefreshCw className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Setting up your interview cabin...</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Loading questions, configuring timers, and launching AI evaluators.</p>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interview cabin error</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">We couldn't retrieve the selected interview track. It may have been deleted or moved.</p>
        <button
          onClick={() => navigate.push('/library')}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
        >
          Back to Library
        </button>
      </div>
    );
  }

  const currentQ = role.questions[currentIdx];
  const currentAnswer = answers[currentQ?.id] || '';
  const isCurrentBookmarked = bookmarked[currentQ?.id] || false;
  const isLastQuestion = currentIdx === role.questions.length - 1;

  // Format time (e.g. 15:00)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // AI Loading Screen
  if (isSubmitting) {
    const steps = [
      'Evaluating technical accuracy and keyword density...',
      'Analyzing communication clarity and structural flow...',
      'Assessing confidence indicators and pacing metrics...',
      'Compiling custom improvement suggestions and report...'
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 text-white p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative mx-auto flex h-20 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 blur-xl animate-pulse" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-500/30 animate-bounce">
              <BrainCircuit className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent">
              AI Assessment Engine Active
            </h2>
            <p className="text-sm text-slate-400">
              Please wait while our language models evaluate your mock session.
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${((submitStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-indigo-300 font-semibold text-left">
              <Sparkles className="h-4 w-4 shrink-0 text-indigo-400 animate-spin" />
              <span>{steps[submitStep]}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* Top Session Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Mock Interview Cabin</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{role.title}</h2>
          </div>
        </div>

        {/* Timer & Progress */}
        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
          {/* Progress Circle/Bar */}
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-semibold text-slate-400">Progress:</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {currentIdx + 1} <span className="text-slate-400 font-normal">of</span> {role.questions.length}
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm">
            <Clock className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Tracker Bar */}
      <div className="grid grid-cols-5 gap-2">
        {role.questions.map((q, idx) => {
          let bgClass = 'bg-slate-200 dark:bg-slate-800';
          if (idx === currentIdx) {
            bgClass = 'bg-indigo-600 dark:bg-indigo-500 ring-4 ring-indigo-500/20';
          } else if (answers[q.id]?.trim().length > 0) {
            bgClass = 'bg-emerald-500 dark:bg-emerald-600';
          } else if (skipped[q.id]) {
            bgClass = 'bg-amber-500 dark:bg-amber-600';
          }
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all ${bgClass}`}
              aria-label={`Go to question ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Main Question & Answer Interface */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">

        {/* Left Column: Question Card & Answer Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                Question {currentIdx + 1}
              </span>
              <button
                onClick={handleBookmark}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Bookmark question"
              >
                {isCurrentBookmarked ? (
                  <BookmarkCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Bookmark className="h-5 w-5 hover:text-indigo-600" />
                )}
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ?.question}
            </h3>
          </div>

          {/* Answer Editor */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Your Answer</h4>
                <p className="text-xs text-slate-400">Type or dictate your structured technical explanation</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {currentAnswer.trim() === '' ? 0 : currentAnswer.trim().split(/\s+/).length} words
              </span>
            </div>

            {/* Answer Text Area */}
            <textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Explain your thoughts clearly. Define the core concepts, discuss how it works, and give any advantages or practical examples..."
              rows={8}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm outline-none transition-all dark:border-slate-800 dark:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-850 dark:text-slate-200 leading-relaxed"
            />

            {/* Simulated speech-to-text cabin */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                onClick={toggleListening}
                className={`flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition-all ${isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/10'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/30'
                  }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    <span>Stop Dictation</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span>Dictate Answer (STT)</span>
                  </>
                )}
              </button>

              {isListening && (
                <div className="flex items-center space-x-1 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 animate-pulse">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mr-2">Listening...</span>
                  {waveform.map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-rose-600 dark:bg-rose-400 rounded-full transition-all"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex w-full sm:w-auto gap-3">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="flex flex-1 sm:flex-none items-center justify-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {isLastQuestion ? (
                <div className="sm:hidden flex-1" />
              ) : (
                <button
                  onClick={handleNext}
                  className="flex flex-1 sm:flex-none items-center justify-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex w-full sm:w-auto gap-3">
              <button
                onClick={handleSkip}
                className="flex flex-1 sm:flex-none items-center justify-center space-x-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                <SkipForward className="h-4 w-4" />
                <span>Skip Question</span>
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  className="flex flex-1 sm:flex-none items-center justify-center space-x-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all"
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>Submit Interview</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex flex-1 sm:flex-none items-center justify-center space-x-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all"
                >
                  <span>Finish Early</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Key Guidance & Instructions */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Tip / Guidance Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-4">
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4" />
              <span>AI Interview Coach Tip</span>
            </h4>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When answering technical questions, try to explicitly mention core concepts. For this question, our AI evaluator is looking for keywords like:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {currentQ?.idealKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                >
                  {kw}
                </span>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Structuring Advice:</strong> Start with a direct definition, explain the underlying mechanism, and conclude with a practical, real-world example.
              </p>
            </div>
          </div>

          {/* Interview Checklist */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interview Checklist</h4>
            <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2.5">
                <input type="checkbox" checked={currentAnswer.trim().length > 10} readOnly className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5" />
                <span className={currentAnswer.trim().length > 10 ? 'line-through text-slate-400' : ''}>Write a detailed definition (&gt;10 words)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  checked={
                    currentQ?.idealKeywords.some(kw => currentAnswer.toLowerCase().includes(kw.toLowerCase())) || false
                  }
                  readOnly
                  className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5"
                />
                <span className={
                  currentQ?.idealKeywords.some(kw => currentAnswer.toLowerCase().includes(kw.toLowerCase()))
                    ? 'line-through text-slate-400'
                    : ''
                }>
                  Incorporate at least 1 key term
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <input type="checkbox" checked={timeSpent[currentQ?.id] > 30} readOnly className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5" />
                <span className={timeSpent[currentQ?.id] > 30 ? 'line-through text-slate-400' : ''}>Spend at least 30 seconds explaining</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
