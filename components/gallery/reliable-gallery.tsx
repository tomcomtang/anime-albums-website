"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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

interface ReliableGalleryProps {
  items: AnimeItem[]
  layout: "grid" | "masonry" // grid用于Action和Drama，masonry用于Comedy、Romance和Fantasy
}

export default function ReliableGallery({ items, layout }: ReliableGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<AnimeItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState<AnimeItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [allLoaded, setAllLoaded] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 20

  // 初始加载第一页
  useEffect(() => {
    loadInitialItems()
  }, [items])

  // 加载初始项目
  const loadInitialItems = () => {
    const initialItems = items.slice(0, ITEMS_PER_PAGE)
    setVisibleItems(initialItems)
    setPage(1)
    setAllLoaded(initialItems.length >= items.length)
  }

  // 加载更多项目
  const loadMoreItems = useCallback(() => {
    if (loading || allLoaded) return

    setLoading(true)

    // 模拟加载延迟
    setTimeout(() => {
      const nextPage = page + 1
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE
      const endIndex = nextPage * ITEMS_PER_PAGE
      const newItems = items.slice(startIndex, endIndex)

      if (newItems.length > 0) {
        setVisibleItems((prev) => [...prev, ...newItems])
        setPage(nextPage)
        setAllLoaded(endIndex >= items.length)
      } else {
        setAllLoaded(true)
      }

      setLoading(false)
    }, 300)
  }, [items, loading, allLoaded, page])

  // 设置交叉观察器来检测何时滚动到底部
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !allLoaded) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [loadMoreItems, loading, allLoaded])

  const handleImageClick = (item: AnimeItem, index: number) => {
    setSelectedImage(item)
    // 计算在整个数据集中的索引
    const fullIndex = visibleItems.findIndex((visibleItem) => visibleItem.id === item.id)
    setCurrentIndex(fullIndex)
  }

  const handleClose = () => {
    setSelectedImage(null)
  }

  const handlePrev = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1
    setCurrentIndex(prevIndex)
    setSelectedImage(visibleItems[prevIndex])
  }

  const handleNext = () => {
    const nextIndex = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(nextIndex)
    setSelectedImage(visibleItems[nextIndex])
  }

  return (
    <div className="gallery-wrapper">
      {/* 图库容器 */}
      <div className={layout === "grid" ? "reliable-grid-gallery" : "reliable-masonry-gallery"}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className={layout === "grid" ? "reliable-grid-item" : "reliable-masonry-item"}
            onClick={() => handleImageClick(item, index)}
          >
            <div className="reliable-image-wrapper">
              <Image
                src={item.coverImage.extraLarge || item.bannerImage || "/placeholder.svg?height=400&width=300"}
                alt={item.title.romaji || item.title.english || "Anime Cover"}
                width={300}
                height={400}
                className="reliable-image"
                loading="lazy"
                style={{ aspectRatio: "3/4" }}
              />
              <div className="reliable-overlay">
                <div className="reliable-title">{item.title.romaji || item.title.english}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多指示器 */}
      <div ref={loaderRef} className="load-more-indicator">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="loading-spinner-small"></div>
          </div>
        )}
        {allLoaded && visibleItems.length > 0 && (
          <div className="text-center py-4 text-muted-foreground">All images loaded</div>
        )}
      </div>

      {/* 图片查看模态框 */}
      {selectedImage && (
        <div className="reliable-modal" onClick={handleClose}>
          <div className="reliable-modal-content">
            <button className="reliable-modal-close" onClick={handleClose}>
              <X size={24} />
            </button>

            <div className="reliable-modal-image-container" onClick={handleClose}>
              <Image
                src={
                  selectedImage.coverImage.extraLarge ||
                  selectedImage.bannerImage ||
                  "/placeholder.svg?height=600&width=450" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={selectedImage.title.romaji || selectedImage.title.english || "Anime Cover"}
                width={450}
                height={600}
                className="reliable-modal-image"
              />

              <div className="reliable-modal-info">
                <h2 className="reliable-modal-title">{selectedImage.title.romaji || selectedImage.title.english}</h2>
                <p className="reliable-modal-counter">
                  {currentIndex + 1} / {visibleItems.length}
                </p>
              </div>

              <button className="reliable-modal-nav reliable-modal-prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
                <ChevronLeft size={30} />
              </button>
              <button className="reliable-modal-nav reliable-modal-next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                <ChevronRight size={30} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
