import ArtisticGalleryClient from "./ArtisticGalleryClient"

export async function generateStaticParams() {
  return [{ category: "Drama" }]
}

export default function DramaGallery() {
  return <ArtisticGalleryClient />
}
