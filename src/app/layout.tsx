// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Portfolio',
  description: 'Created with love by death',
  icons: {
    icon: '/bruh.ico',
    shortcut: '/bruh.png',
    apple: '/bruh.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
