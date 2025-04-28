import WaterfallGalleryClient from "./WaterfallGalleryClient"

export async function generateStaticParams() {
  return [{ category: "Romance" }]
}

export default function RomanceGallery() {
  return <WaterfallGalleryClient />
}
