import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import { AppProviders } from '@/providers/app-providers';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? 'TovaPulse',
  description: 'TovaPulse biometric intelligence dashboard',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable} h-full overflow-hidden`}>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="h-full antialiased overflow-hidden">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
