import { TopBannerSlider } from "@/components/ads/TopBannerSlider"

export default function AdDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBannerSlider />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Top Banner Slider Demo
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          This page demonstrates the rotating top banner advertisement slider
          component. Navigate to <code>/home</code> to see it integrated above
          the main navigation.
        </p>
      </main>
    </div>
  )
}
