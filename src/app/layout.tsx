// src/app/layout.tsx
import './globals.css';
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={publicSans.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}