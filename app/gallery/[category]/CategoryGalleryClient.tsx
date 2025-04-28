"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCategoryData } from "@/lib/data-utils"
import { useLanguage } from "@/lib/i18n/language-context"
import LanguageSwitcher from "@/components/language-switcher"

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

export default function CategoryGalleryClient() {
  const params = useParams()
  const router = useRouter()
  const [animeList, setAnimeList] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [backgroundImage, setBackgroundImage] = useState("")
  const category = params.category as string
  const { t } = useLanguage()

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
  }, [category])

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 relative">
      {/* 若隐若现的背景图 */}
      {backgroundImage && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-10"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToHome")}
            </Button>
            <h1 className="text-3xl font-bold">{category}</h1>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="gallery-grid">
          {animeList.map((anime) => (
            <div key={anime.id} className="gallery-item">
              <Image
                src={anime.coverImage.extraLarge || anime.bannerImage || "/placeholder.svg?height=400&width=300"}
                alt={anime.title.romaji || anime.title.english || "Anime Cover"}
                width={300}
                height={400}
                onClick={() => handleImageClick(anime.coverImage.extraLarge || anime.bannerImage)}
              />
              <div className="gallery-item-info">
                <h3>{anime.title.romaji || anime.title.english}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Image Modal */}
        <div className={`fullscreen-modal ${selectedImage ? "active" : ""}`} onClick={closeModal}>
          {selectedImage && (
            <>
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Full size image"
                width={1200}
                height={800}
                className="fullscreen-image"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="close-modal" onClick={closeModal}>
                <X />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
