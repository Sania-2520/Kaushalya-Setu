import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Kaushalya Setu - Bridge to Your Career',
  description: 'Empowering Polytechnic Students in Karnataka with Skills, Portfolios, and Career Opportunities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        {/* Removed direct Google Font links for Inter as next/font handles it */}
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-secondary/50 text-secondary-foreground py-6 text-center">
          <p>&copy; {new Date().getFullYear()} Kaushalya Setu. All rights reserved.</p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
