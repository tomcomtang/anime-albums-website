import ArtisticGalleryClient from "./ArtisticGalleryClient"

// 为静态导出生成路径参数
export async function generateStaticParams() {
  return [{ category: "Action" }]
}

export default function ActionGallery() {
  return <ArtisticGalleryClient />
}
