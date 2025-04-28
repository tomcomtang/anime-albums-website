"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

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

interface SimpleGalleryProps {
  items: AnimeItem[]
}

export default function SimpleGallery({ items }: SimpleGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<AnimeItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleImageClick = (item: AnimeItem, index: number) => {
    setSelectedImage(item)
    setCurrentIndex(index)
  }

  const handleClose = () => {
    setSelectedImage(null)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
    setSelectedImage(items[currentIndex > 0 ? currentIndex - 1 : items.length - 1])
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
    setSelectedImage(items[currentIndex < items.length - 1 ? currentIndex + 1 : 0])
  }

  return (
    <div className="simple-gallery">
      <div className="simple-gallery-grid">
        {items.map((item, index) => (
          <div key={item.id} className="simple-gallery-item" onClick={() => handleImageClick(item, index)}>
            <Image
              src={item.coverImage.extraLarge || item.bannerImage || "/placeholder.svg?height=400&width=300"}
              alt={item.title.romaji || item.title.english || "Anime Cover"}
              width={300}
              height={400}
              className="simple-gallery-image"
            />
            <div className="simple-gallery-info">
              <h3>{item.title.romaji || item.title.english}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 简单的图片查看模态框 */}
      {selectedImage && (
        <div className="simple-modal" onClick={handleClose}>
          <div className="simple-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="simple-modal-close" onClick={handleClose}>
              <X size={24} />
            </button>

            <div className="simple-modal-image-container">
              <Image
                src={
                  selectedImage.coverImage.extraLarge ||
                  selectedImage.bannerImage ||
                  "/placeholder.svg?height=600&width=450" ||
                  "/placeholder.svg"
                }
                alt={selectedImage.title.romaji || selectedImage.title.english || "Anime Cover"}
                width={450}
                height={600}
                className="simple-modal-image"
              />

              <div className="simple-modal-info">
                <h2 className="simple-modal-title">{selectedImage.title.romaji || selectedImage.title.english}</h2>
                <p className="simple-modal-counter">
                  {currentIndex + 1} / {items.length}
                </p>
              </div>

              <button className="simple-modal-nav simple-modal-prev" onClick={handlePrev}>
                <ChevronLeft size={30} />
              </button>
              <button className="simple-modal-nav simple-modal-next" onClick={handleNext}>
                <ChevronRight size={30} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
