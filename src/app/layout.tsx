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
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
