"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getStatsData } from "@/lib/data-utils"

interface StatsData {
  totalAnime: number
  totalGenres: number
  totalVideos: number
}

export default function AboutPage() {
  const router = useRouter()
  const [stats, setStats] = useState<StatsData>({
    totalAnime: 0,
    totalGenres: 0,
    totalVideos: 0,
  })
  const [backgroundImage, setBackgroundImage] = useState("/placeholder.svg?height=1080&width=1920")

  useEffect(() => {
    const loadStats = async () => {
      const statsData = await getStatsData()
      setStats(statsData)
    }

    loadStats()
  }, [])

  return (
    <div className="min-h-screen relative">
      {/* 若隐若现的背景图 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-20"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* 黑色半透明背景 */}
      <div className="fixed inset-0 bg-black bg-opacity-80 z-0"></div>

      <div className="relative z-10 p-6">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-8 text-white hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="about-container">
          <div className="about-header fade-in-element">
            <h1 className="about-title">About Anime Collection</h1>
            <p className="about-subtitle text-gray-300">Explore the infinite charm of anime</p>
          </div>

          <div className="about-content">
            <div className="about-image fade-in-element delay-200">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Anime Collection"
                width={500}
                height={600}
                className="rounded-xl"
              />
            </div>

            <div className="about-text fade-in-element delay-400 text-gray-200">
              <p>
                Welcome to Anime Collection, a personal collection website designed for anime enthusiasts. Here, you can
                explore selected anime images and videos from AniList and immerse yourself in the wonderful world of
                anime.
              </p>
              <p>
                Our collection includes various types of anime works, from popular shounen manga to niche independent
                works. Each image and video has been carefully selected to showcase the diversity and beauty of anime
                art.
              </p>
              <p>
                In addition to visual enjoyment, we also provide interactive elements such as weather effects and Live2D
                characters to make your browsing experience more vivid and interesting. Whether you are a seasoned anime
                fan or a newcomer just starting to explore the world of anime, there is content here for you.
              </p>
            </div>
          </div>

          <div className="about-stats fade-in-element delay-600">
            <div className="stat-item bg-black bg-opacity-50">
              <div className="stat-number">{stats.totalAnime}</div>
              <div className="stat-label">Anime Collection</div>
            </div>
            <div className="stat-item bg-black bg-opacity-50">
              <div className="stat-number">{stats.totalGenres}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item bg-black bg-opacity-50">
              <div className="stat-number">{stats.totalVideos}</div>
              <div className="stat-label">Videos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
