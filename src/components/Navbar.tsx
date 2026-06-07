'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import {
  Menu, X, Sun, Moon, User, LogOut, Settings,
  LayoutDashboard, BookOpen, GraduationCap, Video
} from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useRouter();
  const pathname = usePathname();

  const handleLogoutClick = () => {
    setShowDropdown(false);
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate.push('/');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    ...(user ? [{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
    { path: '/live-call', label: 'Live Call', icon: Video },
    { path: '/library', label: 'Interview Library', icon: GraduationCap },
    { path: '/question-bank', label: 'Question Bank', icon: BookOpen },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-[#0a0a14]/80 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Logo className="h-9 w-9 transition-transform group-hover:scale-105" />
              <span className="bg-linear-to-r from-slate-900 to-indigo-950 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-white dark:to-indigo-200">
                Interview<span className="text-indigo-600 dark:text-indigo-400">Ace</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive(link.path)
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side controls */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button suppressHydrationWarning
                onClick={toggleTheme}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
              </button>

              {/* Auth section */}
              {user ? (
                <div className="relative">
                  <button suppressHydrationWarning
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 rounded-full p-1 hover:ring-2 hover:ring-indigo-500/20 transition-all focus:outline-none"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-100 bg-white p-1 shadow-xl ring-1 ring-black/5 dark:border-slate-850 dark:bg-slate-900 z-20">
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-400">Signed in as</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <User className="h-4 w-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-400" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setShowDropdown(false)}
                          className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <Settings className="h-4 w-4 text-slate-400" />
                          <span>Settings</span>
                        </Link>
                        <button suppressHydrationWarning
                          onClick={handleLogoutClick}
                          className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth?tab=login"
                    className="text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth?tab=signup"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-500 hover:shadow-indigo-500/20 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button suppressHydrationWarning
                onClick={toggleTheme}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
              </button>
              <button suppressHydrationWarning
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 transition-all">
            <div className="space-y-1 pb-3 pt-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${isActive(link.path)
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-slate-200 pb-3 pt-4 dark:border-slate-800">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center px-3 space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                    />
                    <div>
                      <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                    >
                      <User className="h-5 w-5 text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                    >
                      <Settings className="h-5 w-5 text-slate-400" />
                      <span>Settings</span>
                    </Link>
                    <button suppressHydrationWarning
                      onClick={handleLogoutClick}
                      className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-3">
                  <Link
                    href="/auth?tab=login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth?tab=signup"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </nav>

      {/* Advanced Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100/50 bg-white/95 p-8 shadow-[0_0_50px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#0f0f1a]/95"
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100/80 dark:bg-amber-500/20 border border-amber-200/50 dark:border-amber-500/30 shadow-inner">
                  <LogOut className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>

                <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Ready to leave?
                </h3>

                <p className="mb-8 text-base leading-relaxed text-slate-500 dark:text-slate-400">
                  You are about to sign out of InterviewAce. You will need to log back in to access your interview reports and practice history.
                </p>

                <div className="flex w-full flex-col-reverse space-y-3 space-y-reverse sm:flex-row sm:space-x-4 sm:space-y-0">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 rounded-xl bg-slate-100/80 py-3.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Stay Logged In
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 rounded-xl bg-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Yes, Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
