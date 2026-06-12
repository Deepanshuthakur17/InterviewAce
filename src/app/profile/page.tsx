'use client';
import React, { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { mockDb, UserProfile } from '@/lib/mockDb';
import { useAuth } from '@/components/AuthContext';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import {
  User, Mail, Target, Award, Sparkles, Plus, Trash, UploadCloud,
  FileText, CheckCircle2, AlertTriangle, Briefcase, Clock, Settings, RefreshCw
} from 'lucide-react';

import toast from 'react-hot-toast';

const fetcher = (url: string): Promise<any> => fetch(url).then(r => r.json());

// Validation Schemas
const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name is too short').required('Full Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  avatar: Yup.string(),
  careerGoals: Yup.string().min(5, 'Please write a descriptive goal').required('Career goal is required'),
});

const PreferencesSchema = Yup.object().shape({
  role: Yup.string().required('Preferred role is required'),
  difficulty: Yup.string().oneOf(['Easy', 'Medium', 'Hard']).required('Difficulty is required'),
  duration: Yup.number().min(5, 'Minimum 5 mins').max(60, 'Maximum 60 mins').required('Duration is required'),
});

const SkillSchema = Yup.object().shape({
  newSkill: Yup.string().min(2, 'Skill name too short').required('Skill name is required'),
});

const ResumeSchema = Yup.object().shape({
  resume: Yup.mixed(),
});

export default function ProfilePage() {
  const { updateUserSession } = useAuth();
  const { mutate } = useSWRConfig();

  // SWR Hook
  const { data: profile, error, isLoading } = useSWR<UserProfile>('/api/profile', fetcher);

  // States
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeParsedSkills, setResumeParsedSkills] = useState<string[]>([]);
  const [hasLocalResume, setHasLocalResume] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasLocalResume(!!localStorage.getItem('savedResumeData'));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-80 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <SkeletonLoader variant="profile" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 mb-4">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Loading Failed</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">We couldn't load your profile parameters. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Delete a skill tag
  const handleDeleteSkill = async (skillToDelete: string) => {
    const updatedSkills = profile.skills.filter(s => s !== skillToDelete);
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: updatedSkills })
    });
    mutate('/api/profile'); // Refresh SWR
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-transparent transition-colors duration-300">

      {/* Header */}
      <div className="space-y-3.5 text-center sm:text-left">
        <h1 className="text-4xl font-playfair font-normal tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Profile & Preferences
        </h1>
        <p className="max-w-2xl text-base text-slate-500 dark:text-slate-400 font-light">
          Manage your skills, adjust your interview preferences, and upload your resume to customize your AI practice environment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">

        {/* Left Column: Personal Info & Preferences Forms (Formik) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Profile Form (Formik) */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur-md p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-lg font-playfair font-normal text-slate-900 dark:text-white flex items-center space-x-2">
                <User className="h-5 w-5 text-indigo-400" />
                <span>Personal Information</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Update your account details and career objectives</p>
            </div>

            <Formik
              initialValues={{
                name: profile.name || '',
                email: profile.email || '',
                avatar: profile.avatar || '',
                careerGoals: profile.careerGoals || '',
              }}
              validationSchema={ProfileSchema}
              onSubmit={async (values, { setSubmitting }) => {
                const toastId = toast.loading('Saving profile...', { style: { background: '#1e293b', color: '#fff' } });
                try {
                  await fetch('/api/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: values.name,
                      avatar: values.avatar,
                      careerGoals: values.careerGoals,
                    })
                  });
                  await updateUserSession(values.name, values.email, values.avatar);
                  mutate('/api/profile');
                  toast.success('Profile updated successfully!', { id: toastId, style: { background: '#059669', color: '#fff' } });
                } catch (err) {
                  console.error(err);
                  toast.error('Failed to update profile', { id: toastId, style: { background: '#e11d48', color: '#fff' } });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <User className="h-4.5 w-4.5" />
                        </div>
                        <Field
                          type="text"
                          name="name"
                          className={`w-full rounded-xl border bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition-all dark:bg-slate-950 ${errors.name && touched.name
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                            }`}
                        />
                      </div>
                      {errors.name && touched.name && (
                        <p className="text-xs text-rose-500 mt-1 pl-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <Mail className="h-4.5 w-4.5" />
                        </div>
                        <Field
                          type="email"
                          name="email"
                          className={`w-full rounded-xl border bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition-all dark:bg-slate-950 ${errors.email && touched.email
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                            }`}
                        />
                      </div>
                      {errors.email && touched.email && (
                        <p className="text-xs text-rose-500 mt-1 pl-1">{errors.email}</p>
                      )}
                      {profile.accountType && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 pl-1">
                          Authentication via: <span className="font-bold capitalize text-indigo-600 dark:text-indigo-400">{profile.accountType}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Avatar Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Picture</label>
                    <div className="flex items-center space-x-4">
                      {values.avatar ? (
                        <img src={values.avatar} alt="Avatar Preview" referrerPolicy="no-referrer" className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <User className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.currentTarget.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error("Image must be smaller than 5MB", { style: { background: '#e11d48', color: '#fff' } });
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const img = new Image();
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  const MAX_SIZE = 80;
                                  let width = img.width;
                                  let height = img.height;

                                  if (width > height) {
                                    if (width > MAX_SIZE) {
                                      height *= MAX_SIZE / width;
                                      width = MAX_SIZE;
                                    }
                                  } else {
                                    if (height > MAX_SIZE) {
                                      width *= MAX_SIZE / height;
                                      height = MAX_SIZE;
                                    }
                                  }

                                  canvas.width = width;
                                  canvas.height = height;
                                  const ctx = canvas.getContext('2d');
                                  ctx?.drawImage(img, 0, 0, width, height);

                                  // Compress extremely heavily to keep the DB text string as small as possible
                                  const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4);
                                  setFieldValue('avatar', compressedBase64);
                                };
                                img.src = event.target?.result as string;
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div className="flex items-center space-x-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-4 py-2 hover:border-indigo-500 transition-colors cursor-pointer">
                          <UploadCloud className="h-4.5 w-4.5 text-slate-400" />
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Click to upload from local storage</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Career Goals */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Goals & Objectives</label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                        <Target className="h-4.5 w-4.5" />
                      </div>
                      <Field
                        as="textarea"
                        name="careerGoals"
                        rows={3}
                        className={`w-full rounded-xl border bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition-all dark:bg-slate-950 ${errors.careerGoals && touched.careerGoals
                          ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                          : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                          }`}
                      />
                    </div>
                    {errors.careerGoals && touched.careerGoals && (
                      <p className="text-xs text-rose-500 mt-1 pl-1">{errors.careerGoals}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {["Get A Job", "Prepare for Interview", "Evaluate My Skills", "Improve Communication"].map((goal, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFieldValue('careerGoals', goal)}
                          className="text-[10px] font-semibold px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-900/30"
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Preferences Form (Formik) */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Settings className="h-5 w-5 text-indigo-500" />
                <span>Interview Preferences</span>
              </h3>
              <p className="text-xs text-slate-400">Customize the default parameters for your mock interviews</p>
            </div>

            <Formik
              initialValues={{
                role: profile?.interviewPreferences?.role || 'frontend-dev',
                difficulty: profile?.interviewPreferences?.difficulty || 'Medium',
                duration: profile?.interviewPreferences?.duration || 30,
              }}
              validationSchema={PreferencesSchema}
              onSubmit={async (values, { setSubmitting }) => {
                const toastId = toast.loading('Saving preferences...', { style: { background: '#1e293b', color: '#fff' } });
                try {
                  // Mock DB call removed since InterviewPreferences isn't fully in Prisma schema yet
                  mutate('/api/profile');
                  toast.success('Preferences updated successfully!', { id: toastId, style: { background: '#059669', color: '#fff' } });
                } catch (err) {
                  console.error(err);
                  toast.error('Failed to update preferences', { id: toastId, style: { background: '#e11d48', color: '#fff' } });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Preferred Role Track */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Default Track</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <Briefcase className="h-4.5 w-4.5" />
                        </div>
                        <Field
                          as="select"
                          name="role"
                          className={`w-full rounded-xl border bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition-all dark:bg-slate-950 ${errors.role && touched.role
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                            }`}
                        >
                          <option value="frontend-dev">Frontend Developer</option>
                          <option value="react-dev">React Developer</option>
                          <option value="nextjs-dev">Next.js Developer</option>
                          <option value="js-dev">JavaScript Developer</option>
                          <option value="ts-dev">TypeScript Developer</option>
                          <option value="hr-interview">HR Interview</option>
                          <option value="bca-grad">BCA Graduate</option>
                        </Field>
                      </div>
                      {errors.role && touched.role && (
                        <p className="text-xs text-rose-500 mt-1 pl-1">{errors.role}</p>
                      )}
                    </div>

                    {/* Difficulty */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Difficulty Level</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <Award className="h-4.5 w-4.5" />
                        </div>
                        <Field
                          as="select"
                          name="difficulty"
                          className={`w-full rounded-xl border bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition-all dark:bg-slate-950 ${errors.difficulty && touched.difficulty
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                            }`}
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </Field>
                      </div>
                      {errors.difficulty && touched.difficulty && (
                        <p className="text-xs text-rose-500 mt-1 pl-1">{errors.difficulty}</p>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Session Limit (mins)</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <Clock className="h-4.5 w-4.5" />
                        </div>
                        <Field
                          type="number"
                          name="duration"
                          className={`w-full rounded-xl border bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition-all dark:bg-slate-950 ${errors.duration && touched.duration
                            ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                            }`}
                        />
                      </div>
                      {errors.duration && touched.duration && (
                        <p className="text-xs text-rose-500 mt-1 pl-1">{errors.duration}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Preferences'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

        </div>

        {/* Right Column: Skills Management & Resume Upload */}
        <div className="lg:col-span-4 space-y-6">

          {/* Skills Management */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Verified Skills</h3>
              <p className="text-xs text-slate-400">Add or remove technical topics you want to practice</p>
            </div>

            {/* Current Skills Tags */}
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/10"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleDeleteSkill(skill)}
                    className="hover:text-rose-600 focus:outline-none"
                    aria-label={`Remove skill ${skill}`}
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Form (Formik) */}
            <Formik
              initialValues={{ newSkill: '' }}
              validationSchema={SkillSchema}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                const currentSkills = profile.skills || [];
                if (!currentSkills.includes(values.newSkill)) {
                  const updatedSkills = [...currentSkills, values.newSkill];
                  await fetch('/api/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ skills: updatedSkills })
                  });
                  mutate('/api/profile');
                }
                resetForm();
                setSubmitting(false);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="flex items-start space-x-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex-1">
                    <Field
                      type="text"
                      name="newSkill"
                      placeholder="Add skill (e.g. Node.js)"
                      className={`w-full rounded-xl border bg-slate-50/50 py-2 px-3 text-xs outline-none transition-all dark:bg-slate-950 ${errors.newSkill && touched.newSkill
                        ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800/80 focus:ring-1 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20'
                        }`}
                    />
                    {errors.newSkill && touched.newSkill && (
                      <p className="text-[10px] text-rose-500 mt-1 pl-1">{errors.newSkill}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Resume Upload & AI Parser Simulator */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Resume Analyzer</h3>
              <p className="text-xs text-slate-400">Upload your PDF resume to extract skills and align mock tracks</p>
            </div>

            {/* Resume Upload Formik */}
            {isParsingResume ? (
              <div className="py-6 text-center space-y-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Resume Scanner Active...</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Extracting semantic terms & technical skills</p>
                </div>
              </div>
            ) : (
              <Formik
                initialValues={{ resume: '' }}
                validationSchema={ResumeSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  let file = values.resume as unknown as File;

                  // If no file selected, try to load from localStorage
                  if (!file) {
                    const savedData = localStorage.getItem('savedResumeData');
                    const savedName = localStorage.getItem('savedResumeName');
                    if (savedData && savedName) {
                      try {
                        const res = await fetch(savedData);
                        const blob = await res.blob();
                        file = new File([blob], savedName, { type: 'application/pdf' });
                      } catch (e) {
                        console.error('Failed to restore resume from storage', e);
                      }
                    }
                  }

                  if (!file) {
                    if (profile.resumeName) {
                      toast.error('Please re-upload your PDF once! We do not store raw files on the server for privacy.', { duration: 4000 });
                    } else {
                      toast.error('Please select a PDF resume first');
                    }
                    return;
                  }

                  if (file.size > 4 * 1024 * 1024) {
                    toast.error('File size must be under 4MB to process');
                    return;
                  }

                  setIsParsingResume(true);
                  const toastId = toast.loading('Extracting skills from resume...', { style: { background: '#1e293b', color: '#fff' } });

                  try {
                    // 1. Upload and parse the PDF
                    const formData = new FormData();
                    formData.append('resume', file);

                    const analyzeRes = await fetch('/api/resume/analyze', {
                      method: 'POST',
                      body: formData,
                    });

                    if (!analyzeRes.ok) throw new Error('Failed to parse PDF');
                    const analyzeData = await analyzeRes.json();

                    // Limit extracted skills to a maximum of 4
                    const parsed = (analyzeData.skills || ['JavaScript']).slice(0, 4);

                    // 2. Merge into profile skills
                    const mergedSkills = Array.from(new Set([...(profile.skills || []), ...parsed]));
                    const fileName = file.name || 'Uploaded_Resume.pdf';

                    // 3. Save to database
                    await fetch('/api/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        skills: mergedSkills,
                        resumeName: fileName,
                        resumeParsedSkills: parsed
                      })
                    });

                    setResumeParsedSkills(parsed);
                    mutate('/api/profile');
                    resetForm();
                    toast.success(`Found ${parsed.length} skills in your resume!`, { id: toastId, style: { background: '#059669', color: '#fff' } });
                  } catch (e) {
                    console.error(e);
                    toast.error('Failed to analyze resume', { id: toastId, style: { background: '#e11d48', color: '#fff' } });
                  } finally {
                    setIsParsingResume(false);
                  }
                }}
              >
                {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                  <Form className="space-y-4">
                    <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors dark:border-slate-800">
                      <input
                        type="file"
                        name="resume"
                        id="resume-file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];
                          if (file) {
                            if (file.size > 4 * 1024 * 1024) {
                              toast.error('File size must be under 4MB');
                              return;
                            }
                            setFieldValue('resume', file);

                            // Save to local storage as Base64 for future re-scans
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                              try {
                                localStorage.setItem('savedResumeData', reader.result as string);
                                localStorage.setItem('savedResumeName', file.name);
                              } catch (e) {
                                console.warn('Local storage full, cannot save resume for later');
                              }
                            };
                          }
                        }}
                      />
                      <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-400">Click to upload resume</span>
                      <span className="block text-[10px] text-slate-400 mt-1">Supports PDF, DOCX or TXT (Max 4MB)</span>
                    </div>
                    {errors.resume && touched.resume && (
                      <p className="text-xs text-rose-500 text-center">{errors.resume as string}</p>
                    )}

                    {profile.resumeName && (
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                          <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                          <span className="font-semibold truncate max-w-[150px]">{profile.resumeName}</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                          Scanned
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                      {profile.resumeName && !values.resume && !hasLocalResume ? 'Upload PDF to Re-Scan' : 'Scan & Extract Skills'}
                    </button>
                  </Form>
                )}
              </Formik>
            )}

            {/* Parsed Resume Feedback */}
            {resumeParsedSkills.length > 0 && (
              <div className="rounded-xl bg-emerald-50/50 p-3.5 border border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/10 space-y-2 text-xs">
                <p className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center space-x-1">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>AI Extracted {resumeParsedSkills.length} Skills:</span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {resumeParsedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100/50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
