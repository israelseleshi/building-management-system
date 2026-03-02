import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  const supportedLocales = ['en', 'am'] as const;
  const safeLocale = supportedLocales.includes(locale as any) ? (locale as (typeof supportedLocales)[number]) : 'am';

  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default
  };
});
