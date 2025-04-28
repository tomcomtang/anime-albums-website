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

interface StackedGalleryProps {
  items: AnimeItem[]
  stackSize?: number
}

export default function StackedGallery({ items, stackSize = 5 }: StackedGalleryProps) {
  const [selectedStack, setSelectedStack] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 将项目分组为堆栈
  const stacks = []
  for (let i = 0; i < items.length; i += stackSize) {
    stacks.push(items.slice(i, i + stackSize))
  }

  const handleStackClick = (stackIndex: number) => {
    setSelectedStack(stackIndex)
    setCurrentImageIndex(0)
  }

  const handleClose = () => {
    setSelectedStack(null)
  }

  const handlePrevImage = () => {
    if (selectedStack === null) return
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : stacks[selectedStack].length - 1))
  }

  const handleNextImage = () => {
    if (selectedStack === null) return
    setCurrentImageIndex((prev) => (prev < stacks[selectedStack].length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="stacked-gallery-container">
      <div className="stacked-gallery">
        {stacks.map((stack, stackIndex) => (
          <div key={`stack-${stackIndex}`} className="stack-container" onClick={() => handleStackClick(stackIndex)}>
            {stack.map((item, itemIndex) => {
              const offset = itemIndex * 10 // 每张图片的偏移量
              const zIndex = stack.length - itemIndex // z-index 确保正确的堆叠顺序

              return (
                <div
                  key={item.id}
                  className="stack-item"
                  style={{
                    transform: `translateY(${offset}px) translateX(${offset}px)`,
                    zIndex,
                  }}
                >
                  <Image
                    src={item.coverImage.extraLarge || item.bannerImage || "/placeholder.svg?height=400&width=300"}
                    alt={item.title.romaji || item.title.english || "Anime Cover"}
                    width={300}
                    height={400}
                    className="stack-image"
                  />
                  {itemIndex === 0 && (
                    <div className="stack-info">
                      <h3>{item.title.romaji || item.title.english}</h3>
                      <p className="text-sm opacity-80">{stack.length} images</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* 轮播查看模态框 - 简化动画实现 */}
      {selectedStack !== null && (
        <div className="carousel-modal" onClick={handleClose}>
          <div className="carousel-content" onClick={(e) => e.stopPropagation()}>
            <button className="carousel-close" onClick={handleClose}>
              <X size={24} />
            </button>

            <div className="carousel-image-container">
              <div className="carousel-image-wrapper">
                <Image
                  src={
                    stacks[selectedStack][currentImageIndex].coverImage.extraLarge ||
                    stacks[selectedStack][currentImageIndex].bannerImage ||
                    "/placeholder.svg?height=600&width=450" ||
                    "/placeholder.svg"
                  }
                  alt={
                    stacks[selectedStack][currentImageIndex].title.romaji ||
                    stacks[selectedStack][currentImageIndex].title.english ||
                    "Anime Cover"
                  }
                  width={450}
                  height={600}
                  className="carousel-image"
                />
              </div>

              <div className="carousel-info">
                <h2 className="carousel-title">
                  {stacks[selectedStack][currentImageIndex].title.romaji ||
                    stacks[selectedStack][currentImageIndex].title.english}
                </h2>
                <p className="carousel-counter">
                  {currentImageIndex + 1} / {stacks[selectedStack].length}
                </p>
              </div>

              <button className="carousel-nav carousel-prev" onClick={handlePrevImage}>
                <ChevronLeft size={30} />
              </button>
              <button className="carousel-nav carousel-next" onClick={handleNextImage}>
                <ChevronRight size={30} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
