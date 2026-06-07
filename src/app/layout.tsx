import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PremiumCursor } from '@/components/PremiumCursor';
import '@/app/globals.css';
import { Outfit, Playfair_Display } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'InterviewAce | AI Mock Interviews',
  description: 'AI Interview Practice Platform',
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${outfit.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className="flex min-h-screen flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-100">
        <PremiumCursor />
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" toastOptions={{ duration: 5000, style: { background: '#334155', color: '#fff', borderRadius: '12px' } }} />
        </Providers>
      </body>
    </html>
  );
}
