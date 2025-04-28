"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

export default function Live2dWrapper() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) return
  }, [loaded])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js"
        onLoad={() => setLoaded(true)}
      />
      <div ref={containerRef} className="live2d-container" />
    </>
  )
}

// 为TypeScript添加全局类型定义
declare global {
  interface Window {
    L2Dwidget: {
      init: (config: any) => void
    }
  }
}
