
import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '@/components/main-layout';
import { Toaster } from "@/components/ui/toaster";
import { TradingProvider } from '@/context/trading-context';
import { AdminProvider } from '@/context/admin-context';
import { AuthProvider } from '@/context/auth-context';
import { TransactionProvider } from '@/context/transaction-context';
import { ThemeProvider } from '@/context/theme-context';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <TransactionProvider>
              <TradingProvider>
                <AdminProvider>
                  <div className="flex h-dvh w-full items-center justify-center p-0 sm:p-4">
                    <div className="relative w-full max-w-sm h-full sm:h-[95vh] sm:max-h-[900px] overflow-hidden rounded-none sm:rounded-3xl border-y-0 sm:border-8 border-neutral-800 bg-background shadow-2xl">
                      <MainLayout>{children}</MainLayout>
                      <Toaster />
                    </div>
                  </div>
                </AdminProvider>
              </TradingProvider>
            </TransactionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
