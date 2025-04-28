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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
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

  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
  }

  const closeModal = () => {
    setSelectedIndex(null)
  }

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null && animeList.length > 0) {
      setSelectedIndex((selectedIndex - 1 + animeList.length) % animeList.length)
    }
  }

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null && animeList.length > 0) {
      setSelectedIndex((selectedIndex + 1) % animeList.length)
    }
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
          {animeList.map((anime, idx) => (
            <div key={anime.id} className="gallery-item">
              <Image
                src={anime.coverImage.extraLarge || anime.bannerImage || "/placeholder.svg?height=400&width=300"}
                alt={anime.title.romaji || anime.title.english || "Anime Cover"}
                width={300}
                height={400}
                onClick={() => handleImageClick(idx)}
              />
              <div className="gallery-item-info">
                <h3>{anime.title.romaji || anime.title.english}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Image Modal */}
        <div className={`fullscreen-modal ${selectedIndex !== null ? "active" : ""}`} onClick={closeModal}>
          {selectedIndex !== null && (
            <>
              <button
                className="fullscreen-nav prev"
                style={{
                  position: "absolute",
                  left: "2vw",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1010,
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  border: "none",
                  fontSize: "2rem",
                  borderRadius: "50%",
                  cursor: "pointer",
                  padding: "0.5em 1em"
                }}
                onClick={showPrev}
                aria-label="Previous image"
              >
                ←
              </button>
              <img
                src={
                  animeList[selectedIndex]?.coverImage.extraLarge ||
                  animeList[selectedIndex]?.bannerImage ||
                  "/placeholder.svg"
                }
                alt="Full size image"
                className="fullscreen-image"
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: "90vw", maxHeight: "90vh", width: "auto", height: "auto" }}
              />
              <button
                className="fullscreen-nav next"
                style={{
                  position: "absolute",
                  right: "2vw",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1010,
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  border: "none",
                  fontSize: "2rem",
                  borderRadius: "50%",
                  cursor: "pointer",
                  padding: "0.5em 1em"
                }}
                onClick={showNext}
                aria-label="Next image"
              >
                →
              </button>
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
