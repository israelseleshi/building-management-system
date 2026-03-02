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
      className="w-full border-b border-slate-800 bg-slate-950 text-white overflow-hidden"
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        slidesPerView={1}
        pagination={{ clickable: true }}
        className="w-full h-32 sm:h-36 md:h-44 lg:h-52"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full flex items-center">
              {/* Background image with cover fit */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={slide.id === 1}
                  loading={slide.id === 1 ? "eager" : "lazy"}
                  className="object-cover opacity-60 sm:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent sm:from-black/80 sm:via-black/50 sm:to-black/30" />
              </div>

              {/* Overlay content */}
              <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10">
                <motion.div
                  className="max-w-5xl w-full flex flex-col items-start text-left"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {slide.eyebrow && (
                    <span className="mb-1.5 inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                      {slide.eyebrow}
                    </span>
                  )}
                  <h2 className="text-sm sm:text-lg md:text-2xl font-bold text-white leading-tight max-w-[85%] sm:max-w-none">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="mt-1 hidden xs:block text-[10px] sm:text-sm md:text-base text-slate-300 max-w-lg line-clamp-1 sm:line-clamp-none">
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.cta && slide.href && (
                    <div className="mt-2 sm:mt-3">
                      <motion.a
                        href={slide.href}
                        className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 sm:px-5 sm:py-2 text-[10px] sm:text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/40"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {slide.cta}
                      </motion.a>
                    </div>
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
