// src/app/layout.tsx
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["en", "am"] as const;

export default async function RootLayout({
  children,
  
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = SUPPORTED_LOCALES.includes(cookieLocale as any)
    ? (cookieLocale as (typeof SUPPORTED_LOCALES)[number])
    : "am";
  const messages = (await import(`../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: 'Addis Sans';
            src: url('/fonts/Addis-Sans.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          html[lang="am"] body,
          .amharic {
            font-family: 'Addis Sans', sans-serif !important;
          }
        `}} />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
