import WaterfallGalleryClient from "./WaterfallGalleryClient"

export async function generateStaticParams() {
  return [{ category: "Fantasy" }]
}

export default function FantasyGallery() {
  return <WaterfallGalleryClient />
}
