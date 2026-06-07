'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Bell, Shield, Sliders, Monitor, 
  Save, AlertCircle, LogOut
} from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useTheme } from '@/components/ThemeContext';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUserSession, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useRouter();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [name, setName] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          if (data.name) setName(data.name);
          if (data.avatar) setAvatar(data.avatar);
          if (data.careerGoals) setCareerGoals(data.careerGoals);
        })
        .catch(err => console.error('Failed to load profile settings:', err));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          careerGoals,
          avatar
        })
      });
      const data = await res.json();
      if (res.ok) {
        updateUserSession(data.name, data.email, data.avatar);
        toast.success('Settings updated successfully!');
      } else {
        toast.error(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please enter both current and new passwords.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast.error(data.error || 'Failed to update password');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during password update.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Account deleted successfully.');
        logout();
        navigate.push('/');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete account.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting account.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Account Settings
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage your account preferences, profile details, and security settings.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 mb-8 md:mb-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-slate-200/50 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800/50 dark:bg-[#0a0a14]"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update your public profile and details.</p>
                </div>
                
                <div className="flex items-center space-x-5">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200 dark:border-slate-800">
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={user.name} className="h-full w-full object-cover" />
                  </div>
                  <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                    Change Avatar
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input type="email" disabled defaultValue={user.email} className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400 cursor-not-allowed" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Target Role / Title</label>
                    <input 
                      type="text" 
                      value={careerGoals}
                      onChange={e => setCareerGoals(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500" 
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</label>
                    <textarea 
                      rows={4} 
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell us a little about yourself..." 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Application Preferences</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Customize how InterviewAce looks and behaves.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Dark Mode</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark/light theme manually.</p>
                      </div>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <Sliders className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">AI Feedback Strictness</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Adjust how harshly the AI grades your answers.</p>
                      </div>
                    </div>
                    <select defaultValue="Standard" className="rounded-lg border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <option value="Lenient">Lenient</option>
                      <option value="Standard">Standard</option>
                      <option value="Strict">Strict (FAANG level)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Email Notifications</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Control when and how we contact you.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Weekly Practice Reminders', desc: 'Get an email to remind you to practice if you miss a week.' },
                    { title: 'New Mock Scenarios', desc: 'Be notified when we add new role-specific interview tracks.' },
                    { title: 'Marketing & Offers', desc: 'Receive occasional discounts and premium feature updates.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center mt-1">
                        <input type="checkbox" className="peer sr-only" defaultChecked={i !== 2} />
                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-slate-700"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security & Privacy</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Keep your account safe.</p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                    <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Change Password</h3>
                    <div className="space-y-4">
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Current Password" 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500" 
                      />
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="New Password" 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500" 
                      />
                      <button 
                        onClick={handleUpdatePassword}
                        disabled={isUpdatingPassword}
                        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white disabled:opacity-50"
                      >
                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900/30 dark:bg-rose-950/10">
                    <h3 className="font-semibold text-rose-700 dark:text-rose-400">Danger Zone</h3>
                    <p className="mt-1 text-sm text-rose-600/80 dark:text-rose-400/80">Permanently delete your account and all associated interview history.</p>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="mt-4 rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:bg-rose-950 dark:hover:bg-rose-900 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Global Save Button */}
            {activeTab !== 'security' && (
              <div className="mt-8 flex justify-end border-t border-slate-100 pt-6 dark:border-slate-800">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all"
                >
                  {isSaving ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Account Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          handleDeleteAccount();
        }}
        title="Delete Account"
        description="Are you absolutely sure? This action cannot be undone. All your interview history, mock reports, and account data will be permanently deleted."
        confirmText="Yes, delete my account"
        cancelText="Cancel"
        icon={AlertCircle}
        variant="danger"
      />
    </div>
  );
}
