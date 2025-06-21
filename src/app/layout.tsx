import React from 'react';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'StealthScore - Privacy-First AI Pitch Analysis',
  description: 'Revolutionary AI-powered pitch analysis with military-grade AES-256 encryption. Get real-time feedback and insights while maintaining complete privacy.',
  keywords: 'pitch analysis, AI, privacy, encryption, startup, funding, investor, pitch deck',
  authors: [{ name: 'StealthScore Team' }],
  creator: 'StealthScore',
  publisher: 'StealthScore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pitchguard-2e687.web.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'StealthScore - Privacy-First AI Pitch Analysis',
    description: 'Revolutionary AI-powered pitch analysis with military-grade AES-256 encryption.',
    url: 'https://pitchguard-2e687.web.app',
    siteName: 'StealthScore',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stealth Score - Privacy-Preserving AI Pitch Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StealthScore - Privacy-First AI Pitch Analysis',
    description: 'Revolutionary AI-powered pitch analysis with military-grade AES-256 encryption.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en" className={`${montserrat.variable}`}>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#6366f1" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </head>
        <body className={`${inter.className} font-montserrat antialiased bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 min-h-screen`}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                color: '#fff',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(10px)',
                fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
              },
            }}
          />
        </body>
      </html>
    </AuthProvider>
  );
}
