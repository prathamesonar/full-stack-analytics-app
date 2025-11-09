
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers/SWRProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flowbit AI Analytics Dashboard',
  description: 'AI-powered Financial Analytics Dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar (Fixed Width) */}
            <div className="w-[280px] flex-shrink-0">
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}