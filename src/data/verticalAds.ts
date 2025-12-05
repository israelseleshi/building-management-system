export type VerticalAd = {
  id: number
  images: string[]
  url: string
}

export const leftAds: VerticalAd[] = [
  {
    id: 1,
    images: ["/ads/left1-1.jpg", "/ads/left1-2.jpg"],
    url: "https://example.com",
  },
  {
    id: 2,
    images: ["/ads/left2-1.jpg", "/ads/left2-2.jpg"],
    url: "https://example.com",
  },
  {
    id: 3,
    images: ["/ads/left3-1.jpg", "/ads/left3-2.jpg"],
    url: "https://example.com",
  },
]

export const rightAds: VerticalAd[] = [
  {
    id: 1,
    images: ["/ads/right1-1.jpg", "/ads/right1-2.jpg"],
    url: "https://example.com",
  },
  {
    id: 2,
    images: ["/ads/right2-1.jpg", "/ads/right2-2.jpg"],
    url: "https://example.com",
  },
  {
    id: 3,
    images: ["/ads/right3-1.jpg", "/ads/right3-2.jpg"],
    url: "https://example.com",
  },
]
