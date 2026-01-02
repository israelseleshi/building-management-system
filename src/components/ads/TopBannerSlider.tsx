"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

const slides = [
  // Slide 1: Telebirr / seamless payments hero
  {
    id: 1,
    image: "/ads/top-banner-1.png",
    alt: "Telebirr integration banner",
    eyebrow: "Seamless payments",
    title: "Integrate with Telebirr for instant rent collection",
    subtitle: "Delight tenants with secure, one-tap digital payments.",
    cta: "Learn more",
    href: "#",
  },
  // Slide 2: Fast rentals
  {
    id: 2,
    image: "/ads/top-banner-2.jpg",
    alt: "Modern apartments skyline",
    eyebrow: "Find rentals fast",
    title: "Fill your listings in record time",
    subtitle: "Smart search, verified tenants, and beautiful property pages.",
    cta: "Browse listings",
    href: "/home/listings",
  },
  // Slide 3: Owner dashboard
  {
    id: 3,
    image: "/ads/top-banner-3.jpg",
    alt: "Property owner dashboard",
    eyebrow: "For owners & managers",
    title: "See every building at a glance",
    subtitle: "Real-time insights on occupancy, revenue, and leases.",
    cta: "View dashboard",
    href: "#",
  },
  // Slide 4: Trust & security
  {
    id: 4,
    image: "/ads/top-banner-4.jpg",
    alt: "Happy tenants in lobby",
    eyebrow: "Trusted platform",
    title: "Give tenants a five-star experience",
    subtitle: "Secure messaging, documents, and digital signatures in one place.",
    cta: "Get started",
    href: "/auth/signup",
  },
]

export function TopBannerSlider() {
  return (
    <section
      aria-label="Featured promotions"
      className="w-full border-b border-slate-800 bg-slate-950 text-white"
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        slidesPerView={1}
        pagination={{ clickable: true }}
        className="w-full h-28 sm:h-32 md:h-40 lg:h-48"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background image with cover fit */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={slide.id === 1}
                  loading={slide.id === 1 ? "eager" : "lazy"}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
              </div>

              {/* Overlay content */}
              <div className="relative z-10 flex h-full w-full items-center justify-center px-4 sm:px-6 lg:px-10">
                <motion.div
                  className="max-w-5xl w-full flex flex-col items-center justify-center text-center sm:items-start sm:text-left"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {slide.eyebrow && (
                    <span className="mb-2 inline-flex items-center rounded-full bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
                      {slide.eyebrow}
                    </span>
                  )}
                  <h2 className="text-base sm:text-lg md:text-2xl font-semibold text-white drop-shadow-md">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="mt-1 text-xs sm:text-sm md:text-base text-slate-200/90 max-w-2xl">
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.cta && slide.href && (
                    <motion.a
                      href={slide.href}
                      className="mt-3 inline-flex items-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition-transform hover:scale-[1.03] hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {slide.cta}
                    </motion.a>
                  )}
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
