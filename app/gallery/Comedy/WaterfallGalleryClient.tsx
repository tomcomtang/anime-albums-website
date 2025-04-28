"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCategoryData } from "@/lib/data-utils"
import ReliableGallery from "@/components/gallery/reliable-gallery"

interface AnimeItem {
  id: number
  title: {
    romaji: string
    english: string
    native: string
  }
  coverImage: {
    extraLarge: string
    large: string
    medium: string
    color: string
  }
  bannerImage: string
}

export default function WaterfallGalleryClient() {
  const router = useRouter()
  const [animeList, setAnimeList] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [backgroundImage, setBackgroundImage] = useState("")
  const category = "Comedy"

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const data = await getCategoryData("genres", category)
        if (data) {
          setAnimeList(data)

          // 随机选择一张图片作为背景
          if (data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length)
            const randomImage = data[randomIndex].bannerImage || data[randomIndex].coverImage.extraLarge
            if (randomImage) {
              setBackgroundImage(randomImage)
            }
          }
        }
        setLoading(false)
      } catch (error) {
        console.error(`Error loading data for category ${category}:`, error)
        setLoading(false)
      }
    }

    loadCategoryData()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* 若隐若现的背景图 */}
      {backgroundImage && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* 黑色半透明背景 */}
      <div className="fixed inset-0 bg-black bg-opacity-80 z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/")} className="mr-4 text-white hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-white">{category}</h1>
          </div>
        </div>

        <div className="gallery-container">
          <ReliableGallery items={animeList} layout="masonry" />
        </div>
      </div>
    </div>
  )
}
