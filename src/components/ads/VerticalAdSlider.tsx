"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/autoplay"

import type { VerticalAd } from "@/data/verticalAds"

type VerticalAdSliderProps = {
  ads: VerticalAd[]
  position: "left" | "right"
}

export function VerticalAdSlider({ ads, position }: VerticalAdSliderProps) {
  if (!ads?.length) return null

  return (
    <div className="hidden lg:block">
      <div className="sticky top-28">
        <div className="w-44 xl:w-52 2xl:w-60">
          <Swiper
            direction="vertical"
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            slidesPerView={3}
            spaceBetween={16}
            className="w-full h-[700px] xl:h-[780px] 2xl:h-[840px]"
          >
            {ads.map((ad) => (
              <SwiperSlide key={`${position}-${ad.id}`} className="!h-auto">
                <a
                  href={ad.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <div className="w-full overflow-hidden rounded-xl shadow-md bg-card border border-border min-h-[220px] flex items-center justify-center p-2">
                    <Swiper
                      modules={[Autoplay]}
                      autoplay={{ delay: 3000, disableOnInteraction: false }}
                      loop
                      slidesPerView={1}
                      autoHeight
                      className="w-full"
                    >
                      {ad.images.map((src, index) => (
                        <SwiperSlide
                          key={`${position}-${ad.id}-image-${index}`}
                          className="!h-auto"
                        >
                          <img
                            src={src}
                            alt="Advertisement"
                            className="w-full h-auto object-contain"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}
