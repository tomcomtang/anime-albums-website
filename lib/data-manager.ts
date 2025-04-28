// Import JSON data directly
import genresData from "../public/data/genres.json"
import formatsData from "../public/data/formats.json"
import yearsData from "../public/data/years.json"
import statusData from "../public/data/status.json"

export async function getCategories(): Promise<string[]> {
  // Simulate loading delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const categories = []

  // Check if each data source has data
  if (Object.keys(genresData).length > 0) categories.push("genres")
  if (Object.keys(formatsData).length > 0) categories.push("formats")
  if (Object.keys(yearsData).length > 0) categories.push("years")
  if (Object.keys(statusData).length > 0) categories.push("status")

  return categories
}

export async function getCategoryData(category: string): Promise<any> {
  // Simulate loading delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  // Return data based on category
  switch (category) {
    case "genres":
      return genresData
    case "formats":
      return formatsData
    case "years":
      return yearsData
    case "status":
      return statusData
    default:
      return null
  }
}

export async function downloadCategoryData(category: string): Promise<Blob> {
  const data = await getCategoryData(category)

  if (!data) {
    throw new Error(`No data found for category: ${category}`)
  }

  const jsonString = JSON.stringify(data, null, 2)
  return new Blob([jsonString], { type: "application/json" })
}
