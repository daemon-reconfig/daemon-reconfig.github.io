// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Portfolio',
  description: 'Created with love by death',
  icons: {
    icon: '/bruh.ico',            // used by most browsers
    shortcut: '/bruh.png',  // if you want a PNG fallback
    apple: '/bruh.png',  // for iOS home‐screen
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
