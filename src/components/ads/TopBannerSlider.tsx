"use client"

import { topBannerAds } from "@/data/ads"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/autoplay"

export function TopBannerSlider() {
  return (
    <div className="w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-3">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          className="w-full"
        >
          {topBannerAds.map((ad) => (
            <SwiperSlide key={ad.id}>
              <a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <div className="w-full overflow-hidden rounded-xl shadow-md bg-card border border-border">
                  <img
                    src={ad.image}
                    alt="Advertisement banner"
                    className="w-full h-20 sm:h-24 md:h-28 lg:h-32 object-contain bg-black"
                  />
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
