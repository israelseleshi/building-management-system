"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Tenant");
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/40">
                BMS
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-wide text-slate-100">
                  BMS
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">
                  Building Management System
                </span>
              </div>
            </div>
            <p className="max-w-xs text-sm text-slate-400">
              {t("footer.description")}
            </p>
          </div>

          {/* Product column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="group inline-flex items-center text-slate-400 transition-colors hover:text-emerald-400"
                >
                  <span>{t("nav.services")}</span>
                  <span className="ml-1 h-px w-0 bg-emerald-400 transition-all duration-200 group-hover:w-5" />
                </Link>
              </li>
              <li>
                <Link
                  href="/home/listings"
                  className="group inline-flex items-center text-slate-400 transition-colors hover:text-emerald-400"
                >
                  <span>{t("nav.listings")}</span>
                  <span className="ml-1 h-px w-0 bg-emerald-400 transition-all duration-200 group-hover:w-5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {t("footer.support")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="group inline-flex items-center text-slate-400 transition-colors hover:text-emerald-400"
                >
                  <span>{t("nav.about")}</span>
                  <span className="ml-1 h-px w-0 bg-emerald-400 transition-all duration-200 group-hover:w-5" />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="group inline-flex items-center text-slate-400 transition-colors hover:text-emerald-400"
                >
                  <span>{t("nav.contact")}</span>
                  <span className="ml-1 h-px w-0 bg-emerald-400 transition-all duration-200 group-hover:w-5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="group inline-flex items-center text-slate-400 transition-colors hover:text-emerald-400"
                >
                  <span>Privacy</span>
                  <span className="ml-1 h-px w-0 bg-emerald-400 transition-all duration-200 group-hover:w-5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-center sm:text-left">
            © 2025 Building Management System. {t("footer.rights")}
          </p>

          {/* Optional social icons */}
          <div className="flex items-center gap-4 text-slate-500">
            <Link
              href="#"
              aria-label="BMS on LinkedIn"
              className="transition-colors hover:text-emerald-400"
            >
              <span className="text-sm">in</span>
            </Link>
            <Link
              href="#"
              aria-label="BMS on Twitter"
              className="transition-colors hover:text-emerald-400"
            >
              <span className="text-sm">X</span>
            </Link>
            <Link
              href="#"
              aria-label="BMS on YouTube"
              className="transition-colors hover:text-emerald-400"
            >
              <span className="text-sm">▶</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
