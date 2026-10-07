import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import StoreProvider from '@/StoreProvider';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Komunitas Berbagi Baik',
  description: 'Lanjutkan berbagi cerita dan terhubung dengan komunitas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="h-full bg-[var(--paper)] text-[var(--ink)]">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}