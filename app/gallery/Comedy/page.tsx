import WaterfallGalleryClient from "./WaterfallGalleryClient"

export async function generateStaticParams() {
  return [{ category: "Comedy" }]
}

export default function ComedyGallery() {
  return <WaterfallGalleryClient />
}
