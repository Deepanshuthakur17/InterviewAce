'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import dynamic from 'next/dynamic';

import { ShaderGradientBackground } from '@/components/ShaderGradientBackground';
import {
  BrainCircuit, Star, ArrowRight, ShieldCheck, Zap, BarChart3,
  Sparkles, GraduationCap, Users, Play, Quote, Check, HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: BrainCircuit,
      title: 'AI-Powered Analysis',
      description: 'Get instant, granular feedback on your technical accuracy, communication skills, and confidence level within seconds of submission.'
    },
    {
      icon: GraduationCap,
      title: 'Role-Specific Libraries',
      description: 'Practice curated tracks for Frontend, React, Next.js, JavaScript, TypeScript, HR Behavioral, and specialized BCA academic interviews.'
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Track your growth over time, identify weak topics, map your weekly progress, and watch your readiness score climb.'
    },
    {
      icon: Sparkles,
      title: 'Smart Resume Parsing',
      description: 'Upload your resume to instantly extract key technical skills and auto-generate customized mock interview questions.'
    },
    {
      icon: Zap,
      title: 'Real-Time Timer & Pacing',
      description: 'Simulate high-pressure environments with adaptive time limits, bookmarks, and skip options to build real-world confidence.'
    },
    {
      icon: ShieldCheck,
      title: 'Comprehensive Question Bank',
      description: 'Browse hundreds of vetted questions across multiple categories, filter by difficulty, and save your favorites to study.'
    }
  ];

  const testimonials = [
    {
      quote: "InterviewAce was a complete game-changer for me. The tailored Next.js and React tracks perfectly mirrored my actual technical rounds. I went into my interviews with zero anxiety and landed a Frontend role!",
      author: "Priya Sharma",
      role: "BCA Graduate, now Frontend Engineer at TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
      rating: 5
    },
    {
      quote: "The HR behavioral track taught me how to structure my answers using the STAR method. The AI feedback highlighted my bad habit of rushing and skipping definitions. Absolutely invaluable tool.",
      author: "Marcus Chen",
      role: "Full Stack Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      rating: 5
    },
    {
      quote: "As a BCA student, academic interviews can be terrifying. Having a platform that tests core OOPs, OS, and Networking alongside modern JS was exactly what I needed to clear my campus placements.",
      author: "Rohan Das",
      role: "Software Engineer Associate",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
      rating: 5
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for students beginning their prep journey.",
      features: [
        "Access to 3 basic interview tracks",
        "5 AI feedback reports per month",
        "Access to public Question Bank",
        "Basic progress tracking",
        "Email support"
      ],
      cta: "Start for Free",
      popular: false,
      link: "/auth?tab=signup"
    },
    {
      name: "Pro Ace",
      price: "$19",
      period: "per month",
      description: "Everything you need to clear elite tech interviews.",
      features: [
        "Unlimited access to all 35+ interview tracks",
        "Unlimited AI-powered feedback reports",
        "Sleek resume upload & custom track generation",
        "Deep metrics: technical, communication & confidence",
        "Save favorites & bookmark questions",
        "Priority AI processing & support"
      ],
      cta: "Upgrade to Pro",
      popular: true,
      link: "/auth?tab=signup"
    },
    {
      name: "Placement Team",
      price: "$49",
      period: "per user/mo",
      description: "Designed for colleges, bootcamps, and study groups.",
      features: [
        "Custom interview track builder for instructors",
        "Student performance analytics dashboard",
        "Exportable PDF report cards",
        "Bulk seat licensing & LMS integration",
        "Dedicated account manager",
        "24/7 SLA Support"
      ],
      cta: "Contact Placement",
      popular: false,
      link: "/auth?tab=signup"
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <ShaderGradientBackground />
        {/* Subtle overlay for text readability (only in light mode) */}
        <div className="absolute inset-0 bg-slate-50/70 dark:bg-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Hero Text */}
            <div className="text-center lg:col-span-7 lg:text-left space-y-6">
              <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Next-Gen AI Mock Interview Platform</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                Ace Your Tech & HR Interviews with{' '}
                <span className="bg-linear-to-r from-orange-500 via-rose-500 to-violet-500 bg-clip-text text-transparent dark:from-orange-400 dark:via-rose-400 dark:to-violet-400 drop-shadow-sm">
                  Instant AI Feedback
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 lg:mx-0">
                Practice realistic technical and behavioral interviews. Receive instant communication, confidence, and technical scoring, custom keypoints, and step-by-step improvement guides.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  href={user ? "/library" : "/auth?tab=signup"}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all duration-200"
                >
                  <span>Start Free Practice</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/library"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
                >
                  <Play className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                  <span>Browse Tracks</span>
                </Link>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">94%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Placement Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">15k+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Interviews Analyzed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">35+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Specialized Tracks</p>
                </div>
              </div>
            </div>

            {/* Hero Image / Animated Demo */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-tr from-indigo-500 to-violet-500 opacity-30 blur-xl dark:opacity-20" />
              <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <img
                  src="/images/hero-student.jpg"
                  alt="Student preparing for interview with InterviewAce"
                  className="rounded-xl w-full h-[400px] object-cover"
                />

                {/* Floating Feedback Card */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 max-w-[240px] animate-bounce-slow">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">AI Score Report</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">Overall: 88%</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>Technical Accuracy</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">92%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>

                {/* Floating Track Badge */}
                <div className="absolute -top-6 -right-4 rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Next.js Developer Track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Platform Features</h2>
            <p className="text-3xl font-extrabold sm:text-4xl text-slate-900 dark:text-white">
              Everything you need to go from preparation to offer letter.
            </p>
            <p className="text-base text-slate-500 dark:text-slate-400">
              We combine robust pedagogical design with intelligent language processing to deliver a professional mock environment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900 transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/40 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-white transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Success Stories</h2>
            <p className="text-3xl font-extrabold sm:text-4xl text-slate-900 dark:text-white">
              Loved by thousands of students and placement cells.
            </p>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Read how candidates unlocked confidence and secured roles in top tech companies.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 md:grid-cols-2">
            {testimonials.map((test, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div className="absolute top-6 right-6 text-indigo-100 dark:text-indigo-950/40">
                  <Quote className="h-10 w-10 stroke-[4px]" />
                </div>
                <div>
                  <div className="flex space-x-1 mb-4">
                    {Array.from({ length: test.rating }).map((_, r) => (
                      <Star key={r} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 italic">
                    "{test.quote}"
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={test.avatar}
                    alt={test.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{test.author}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Pricing Plans</h2>
            <p className="text-3xl font-extrabold sm:text-4xl text-slate-900 dark:text-white">
              Invest in your career. Pay once or subscribe.
            </p>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Clear tiers with transparent pricing. No hidden fees. Lock in your placements today.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ${tier.popular
                  ? 'border-2 border-indigo-600 bg-white shadow-xl dark:bg-slate-900 scale-105 z-10'
                  : 'border border-slate-200/80 bg-white/60 shadow-sm dark:border-slate-800 dark:bg-slate-900/40'
                  }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wide">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{tier.description}</p>

                  <div className="mt-5 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
                    <span className="ml-1 text-xs font-medium text-slate-400">/{tier.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3.5 border-t border-slate-100 pt-6 dark:border-slate-800 text-sm">
                    {tier.features.map((feat, f) => (
                      <li key={f} className="flex items-start space-x-2.5">
                        <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-slate-600 dark:text-slate-300">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={tier.link}
                    className={`block w-full rounded-xl py-3 text-center text-sm font-bold shadow-sm transition-all ${tier.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/20'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Frequently Asked Questions</h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">Have Questions? We Have Answers.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How does the AI feedback work?",
                a: "Our mock interview engine analyzes your submitted text answers against industry-standard rubrics and semantic keywords. It evaluates technical accuracy, structural clarity (using frameworks like STAR), and confidence, returning constructive reviews and specific suggestions in under 3 seconds."
              },
              {
                q: "Can I use speech-to-text to answer questions?",
                a: "Yes! During your interview session, you can use our built-in speech-to-text simulation to dictate your answers, mimicking a live voice interview, or type them directly in the text editor."
              },
              {
                q: "Is there a track specifically for BCA students?",
                a: "Absolutely. We designed a 'BCA Graduate Interview' track covering academic fundamentals such as Object-Oriented Programming (OOP) pillars, SQL/NoSQL databases, networking models (DNS, IP routing), and operating system processes."
              },
              {
                q: "Can I upload my own custom resume?",
                a: "Yes, you can upload your PDF or text resume on the Profile page. Our analyzer will parse your listed skills and experience, then populate your dashboard and customize mock questions."
              }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{faq.q}</h4>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
