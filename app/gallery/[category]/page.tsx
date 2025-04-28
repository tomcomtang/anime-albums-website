// 直接导入JSON数据
import genresData from "../../../public/data/genres.json"
import CategoryGalleryClient from "./CategoryGalleryClient"

// 为静态导出生成路径参数
export async function generateStaticParams() {
  try {
    // 直接使用导入的JSON数据
    const categories = Object.keys(genresData)

    // 为每个类别生成路径参数
    return categories.map((category) => ({
      category: category,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default function CategoryGallery() {
  return <CategoryGalleryClient />
}
