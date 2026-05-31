'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import dynamic from 'next/dynamic';

const ShaderGradientBackground = dynamic(
  () => import('@/components/ShaderGradientBackground').then((mod) => mod.ShaderGradientBackground),
  { ssr: false }
);
import { Logo } from '@/components/Logo';
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
    <div className="bg-white dark:bg-[#0a0a14] text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden bg-transparent">
        <ShaderGradientBackground />
        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Logo in Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 relative group"
          >
            {/* Glowing neon aura behind Logo */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-indigo-500 to-purple-600 opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
            <div className="relative rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-4.5 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/20 hover:scale-105 transition-all duration-300">
              <Logo className="h-20 w-20" />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-indigo-100">Powered by Context-Aware AI</span>
          </motion.div>

          {/* Typography / Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-playfair text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white mb-6"
          >
            Interviews that <br />
            <span className="italic text-transparent bg-clip-text bg-linear-to-r from-blue-300 via-indigo-200 to-purple-300">actually land offers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-lg md:text-xl text-slate-300 font-light mb-12 leading-relaxed"
          >
            A premium mock interview tool for engineers who care about clarity.
            Capture skills, practice dynamically, and turn feedback into your next big role.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              href={user ? "/library" : "/auth?tab=signup"}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-semibold text-slate-900 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-indigo-500/25"
            >
              <span>Start practicing</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/auth?tab=login"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <span>I have an account</span>
            </Link>
          </motion.div>

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
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md dark:border-white/5 dark:bg-slate-900/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <div className="absolute inset-0 -z-10 bg-linear-to-br from-indigo-500/0 to-purple-600/0 opacity-0 group-hover:opacity-10 group-hover:from-indigo-500/10 group-hover:to-purple-600/10 transition-all duration-500 pointer-events-none" />
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
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md dark:border-white/5 dark:bg-slate-900/40 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="absolute inset-0 -z-10 bg-linear-to-br from-indigo-500/0 to-purple-600/0 opacity-0 group-hover:opacity-10 group-hover:from-indigo-500/10 group-hover:to-purple-600/10 transition-all duration-500 pointer-events-none" />
                <div className="absolute top-6 right-6 text-indigo-100 dark:text-indigo-950/20 group-hover:text-indigo-200 dark:group-hover:text-indigo-500/30 transition-colors duration-300">
                  <Quote className="h-10 w-10 stroke-[4px]" />
                </div>
                <div>
                  <div className="flex space-x-1 mb-4">
                    {Array.from({ length: test.rating }).map((_, r) => (
                      <Star key={r} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 italic relative z-10">
                    "{test.quote}"
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
                  <img
                    src={test.avatar}
                    alt={test.author}
                    className="h-10 w-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
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
                className={`group relative overflow-hidden flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ${tier.popular
                  ? 'border-2 border-indigo-600 bg-white shadow-xl dark:bg-slate-900 scale-105 z-10 hover:-translate-y-1 hover:shadow-indigo-500/20'
                  : 'border border-slate-200/80 bg-white/60 shadow-xs backdrop-blur-md dark:border-white/5 dark:bg-slate-900/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10'
                  }`}
              >
                <div className="absolute inset-0 -z-10 bg-linear-to-br from-indigo-500/0 to-purple-600/0 opacity-0 group-hover:opacity-10 group-hover:from-indigo-500/10 group-hover:to-purple-600/10 transition-all duration-500 pointer-events-none" />
                {tier.popular && (
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wide">
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
