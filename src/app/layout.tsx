import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '@/components/main-layout';
import { Toaster } from "@/components/ui/toaster";
import { TradingProvider } from '@/context/trading-context';

export const metadata: Metadata = {
  title: 'wellfiree',
  description: 'A crypto trading app to watch and trade cryptocurrencies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <TradingProvider>
          <div className="flex h-dvh w-full items-center justify-center p-0 sm:p-4">
            <div className="relative w-full max-w-[420px] h-full sm:h-[95vh] sm:max-h-[900px] overflow-hidden rounded-none sm:rounded-3xl border-y-0 sm:border-8 border-neutral-800 bg-background shadow-2xl">
              <MainLayout>{children}</MainLayout>
              <Toaster />
            </div>
          </div>
        </TradingProvider>
      </body>
    </html>
  );
}
