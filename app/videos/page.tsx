"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllTrailers } from "@/lib/data-utils"

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  url: string
  animeTitle: string
}

export default function VideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [backgroundImage, setBackgroundImage] = useState("")

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const trailers = await getAllTrailers()
        setVideos(trailers)

        // 随机选择一个视频缩略图作为背景
        if (trailers.length > 0) {
          const randomIndex = Math.floor(Math.random() * trailers.length)
          setBackgroundImage(trailers[randomIndex].thumbnail)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading videos:", error)
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  const handleVideoClick = (video: VideoItem) => {
    setSelectedVideo(video)
  }

  const closeModal = () => {
    setSelectedVideo(null)
  }

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
            <h1 className="text-3xl font-bold text-white">Videos Collection</h1>
          </div>
        </div>

        <div className="artistic-video-container">
          <div className="video-grid">
            {videos.map((video) => (
              <div key={video.id} className="video-item fade-in-element" onClick={() => handleVideoClick(video)}>
                <Image
                  src={video.thumbnail || "/placeholder.svg?height=225&width=400"}
                  alt={video.title}
                  width={400}
                  height={225}
                  className="video-thumbnail"
                />
                <div className="video-play-button">
                  <Play fill="white" size={30} />
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-anime">{video.animeTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fullscreen Video Modal */}
        <div className={`fullscreen-modal ${selectedVideo ? "active" : ""}`} onClick={closeModal}>
          {selectedVideo && (
            <>
              <iframe
                src={selectedVideo.url.replace("watch?v=", "embed/")}
                title={selectedVideo.title}
                className="fullscreen-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onClick={(e) => e.stopPropagation()}
              ></iframe>
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
