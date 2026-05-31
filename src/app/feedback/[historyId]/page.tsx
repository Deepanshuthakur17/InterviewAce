'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import useSWR from 'swr';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { mockDb, HistoryItem } from '@/lib/mockDb';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { 
  Award, CheckCircle2, AlertTriangle, Sparkles, MessageSquare, ChevronDown, 
  ChevronUp, ArrowLeft, RefreshCw, Star, Info, Check, Copy, Flame
} from 'lucide-react';

const fetcher = (url: string): Promise<any> => mockDb.get(url);

// Feedback Form Schema
const FeedbackFormSchema = Yup.object().shape({
  rating: Yup.number().min(1, 'Please select a rating').max(5).required('Rating is required'),
  comments: Yup.string().min(10, 'Feedback must be at least 10 characters').required('Comments are required'),
});

export default function FeedbackPage() {
  const { historyId } = useParams<{ historyId: string }>();
  const navigate = useRouter();

  // SWR Hook
  const { data: session, error, isLoading } = useSWR<HistoryItem>(historyId ? `/api/history/${historyId}` : null, fetcher);

  // States
  const [expandedQs, setExpandedQs] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <SkeletonLoader variant="profile" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 mb-4">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assessment Report Not Found</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">We couldn't retrieve the requested feedback report. It may have expired or belongs to another user.</p>
        <button
          onClick={() => navigate.push('/dashboard')}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { feedback, answers, roleTitle } = session;

  const toggleExpand = (id: string) => {
    setExpandedQs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyIdeal = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getOverallFeedbackText = (score: number) => {
    if (score >= 85) return { label: 'Placement Ready', desc: 'Outstanding! Your answers reflect elite technical correctness and exceptional structure. You are fully prepared for actual interviews.', color: 'text-emerald-600 dark:text-emerald-400' };
    if (score >= 70) return { label: 'Strong Candidate', desc: 'Solid performance! You have strong core knowledge. Fine-tuning key terminology and expanding on structural details will push you over the top.', color: 'text-indigo-600 dark:text-indigo-400' };
    return { label: 'Needs Practice', desc: 'Good start, but there are vital technical gaps. Focus on expanding your answers, adding code keywords, and practicing core definitions.', color: 'text-amber-600 dark:text-amber-400' };
  };

  const overallStatus = getOverallFeedbackText(feedback.overallScore);

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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Back to Dashboard */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <Link
          href="/library"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-sm"
        >
          Practice Another Track
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-3.5 bg-white p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Interview Evaluation</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl leading-tight">
          Assessment Report: {roleTitle}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Evaluated on {session.date} &bull; Practice Duration: {Math.round(session.durationSpent / 60)} minutes
        </p>
      </div>

      {/* Overall Score Wheel & Verdict */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-stretch">
        
        {/* Overall Score Wheel */}
        <div className="md:col-span-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center h-32 w-32">
            {/* Circular Progress (SVG) */}
            <svg className="absolute transform -rotate-90 w-full h-full">
              <circle cx="64" cy="64" r="54" strokeWidth="8" stroke="currentColor" fill="transparent" className="text-slate-100 dark:text-slate-800" />
              <circle cx="64" cy="64" r="54" strokeWidth="8" stroke="currentColor" fill="transparent" 
                className="text-indigo-600 dark:text-indigo-500"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - feedback.overallScore / 100)}
              />
            </svg>
            <div className="text-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{feedback.overallScore}%</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Overall</p>
            </div>
          </div>
          <h3 className={`text-lg font-bold mt-4 ${overallStatus.color}`}>{overallStatus.label}</h3>
        </div>

        {/* Detailed Verdict & Dimension Scores */}
        <div className="md:col-span-8 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              <span>AI Evaluator Verdict</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {overallStatus.desc}
            </p>
          </div>

          {/* Dimension Scores */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800 mt-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Technical</p>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{feedback.technicalScore}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 mt-1.5 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${feedback.technicalScore}%` }} />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Communication</p>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{feedback.communicationScore}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 mt-1.5 overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${feedback.communicationScore}%` }} />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confidence</p>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{feedback.confidenceScore}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 mt-1.5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${feedback.confidenceScore}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Suggested Improvements & Common Mistakes */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Suggested Improvements */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>Suggested Improvements</span>
          </h3>
          <ul className="space-y-3.5 text-sm">
            {feedback.suggestedImprovements.map((imp, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 leading-relaxed text-slate-600 dark:text-slate-300">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <span>Common Mistakes Identified</span>
          </h3>
          <ul className="space-y-3.5 text-sm">
            {feedback.commonMistakes.map((mist, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 leading-relaxed text-slate-600 dark:text-slate-300">
                <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{mist}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question by Question Detailed Analysis */}
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-2 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Detailed Question Analysis</h2>
          <p className="text-xs text-slate-400">Expand each question to view feedback and ideal answers</p>
        </div>

        {feedback.detailedAnalysis && feedback.detailedAnalysis.length > 0 ? (
          <div className="space-y-4">
            {feedback.detailedAnalysis.map((item, idx) => {
              const isExpanded = expandedQs[item.questionId] || false;
              // Find matching ideal answer from INITIAL_LIBRARY
              // Since library is loaded dynamically, let's look it up or fallback
              const originalRole = mockDb.getRoleById(session.roleId);
              const originalQ = originalRole?.questions.find(q => q.id === item.questionId);
              const idealAnswer = originalQ?.idealAnswer || 'Ideal answer not cached.';

              return (
                <div 
                  key={item.questionId} 
                  className="rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900 overflow-hidden"
                >
                  {/* Question Header Accordion */}
                  <button
                    onClick={() => toggleExpand(item.questionId)}
                    className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center space-x-4 flex-1 mr-4">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.questionText}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getScoreColor(item.technicalAccuracy)}`}>
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${getScoreBadgeClass(item.technicalAccuracy)}`} />
                        {item.technicalAccuracy}%
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-5 dark:border-slate-800 space-y-5 text-sm bg-slate-50/20 dark:bg-slate-900/10 transition-all">
                      {/* User Answer */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Response:</span>
                        <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-850 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {item.userAnswer || <span className="italic text-slate-400">[No answer provided]</span>}
                        </div>
                      </div>

                      {/* AI Feedback */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Coach Assessment:</span>
                        <div className="rounded-xl bg-indigo-50/30 p-4 border border-indigo-100/30 dark:bg-indigo-950/10 dark:border-indigo-900/10 text-slate-700 dark:text-slate-300 leading-relaxed flex items-start space-x-2.5">
                          <Sparkles className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{item.feedbackText}</span>
                        </div>
                      </div>

                      {/* Missed Keywords */}
                      {item.suggestedAdditions.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Vocabulary to Incorporate:</span>
                          <div className="flex flex-wrap gap-2">
                            {item.suggestedAdditions.map((kw, i) => (
                              <span 
                                key={i} 
                                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30"
                              >
                                + {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ideal Answer */}
                      <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                            <Info className="h-4 w-4 text-indigo-500" />
                            <span>Recommended Ideal Answer:</span>
                          </span>
                          <button
                            onClick={() => handleCopyIdeal(item.questionId, idealAnswer)}
                            className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {copiedId === item.questionId ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="rounded-xl border border-dashed border-indigo-100 bg-indigo-50/10 p-4 dark:border-indigo-950/50 dark:bg-indigo-950/5 text-indigo-950 dark:text-indigo-200 leading-relaxed italic">
                          {idealAnswer}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-2xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">Detailed breakdown is only compiled for attempted answers.</p>
          </div>
        )}
      </div>

      {/* AI Session Rating Form using Formik */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Rate Your AI Feedback</h3>
          <p className="text-xs text-slate-400">Help us improve. Submit a quick feedback rating about the accuracy of this report.</p>
        </div>

        <Formik
          initialValues={{ rating: 5, comments: '' }}
          validationSchema={FeedbackFormSchema}
          onSubmit={(values, { resetForm, setSubmitting, setStatus }) => {
            setTimeout(() => {
              setStatus({ success: true });
              setSubmitting(false);
              resetForm();
            }, 1000);
          }}
        >
          {({ errors, touched, isSubmitting, status, setFieldValue, values }) => (
            <Form className="space-y-4">
              {status?.success ? (
                <div className="flex items-center space-x-2.5 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-bold">Thank you for your feedback!</p>
                    <p className="text-xs mt-0.5">Your rating and comments have been saved to help calibrate our AI language models.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Star Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Feedback Accuracy Rating</label>
                    <div className="flex items-center space-x-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFieldValue('rating', star)}
                          className="p-1 focus:outline-none transition-all hover:scale-110"
                        >
                          <Star 
                            className={`h-6 w-6 ${
                              star <= values.rating 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-300 dark:text-slate-600'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                    {errors.rating && touched.rating && (
                      <p className="text-xs text-rose-500 mt-1">{errors.rating}</p>
                    )}
                  </div>

                  {/* Comments */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Comments / Observations</label>
                    <Field
                      as="textarea"
                      name="comments"
                      placeholder="Were the technical scores accurate? Did the suggestions help you? Tell us how we did..."
                      rows={3}
                      className={`w-full rounded-xl border bg-slate-50/50 p-3.5 text-sm outline-none transition-all dark:bg-slate-950 ${
                        errors.comments && touched.comments
                          ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                          : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                      }`}
                    />
                    {errors.comments && touched.comments && (
                      <p className="text-xs text-rose-500 mt-1 pl-1">{errors.comments}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>

    </div>
  );
};
