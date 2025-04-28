// Import JSON data directly
import genresData from "../public/data/genres.json"
import formatsData from "../public/data/formats.json"
import yearsData from "../public/data/years.json"
import statusData from "../public/data/status.json"
import trailersData from "../public/data/trailers.json"

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
  trailer?: {
    id: string
    site: string
    thumbnail: string
  }
}

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  url: string
  animeTitle: string
}

// Get data for a specific category
export async function getCategoryData(dataType: string, category: string): Promise<AnimeItem[]> {
  try {
    // Select the corresponding imported data based on the data type
    let data
    switch (dataType) {
      case "genres":
        data = genresData
        break
      case "formats":
        data = formatsData
        break
      case "years":
        data = yearsData
        break
      case "status":
        data = statusData
        break
      default:
        data = {}
    }

    return data[category] || []
  } catch (error) {
    console.error(`Error getting ${category} data:`, error)
    return []
  }
}

// Get all categories
export async function getAllCategories(): Promise<string[]> {
  try {
    return Object.keys(genresData)
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

// Get a random trailer
export async function getRandomTrailer(): Promise<VideoItem | null> {
  try {
    // First, try to get a trailer from the dedicated trailer collection
    if (trailersData && trailersData.length > 0) {
      const randomIndex = Math.floor(Math.random() * trailersData.length)
      const trailer = trailersData[randomIndex]

      if (trailer.trailer && trailer.trailer.id && trailer.trailer.site === "youtube") {
        return {
          id: trailer.trailer.id,
          title: "Trailer",
          thumbnail: trailer.trailer.thumbnail || trailer.coverImage.extraLarge,
          url: `https://www.youtube.com/embed/${trailer.trailer.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.trailer.id}`,
          animeTitle: trailer.title.romaji || trailer.title.english,
        }
      }
    }

    // If the dedicated trailer collection doesn't have data, search other data sources
    const trailers: VideoItem[] = []
    const processedIds = new Set()

    // Process genres data
    for (const category in genresData) {
      const animeList = genresData[category]
      for (const anime of animeList) {
        if (
          anime.trailer &&
          anime.trailer.id &&
          anime.trailer.site === "youtube" &&
          !processedIds.has(anime.trailer.id)
        ) {
          trailers.push({
            id: anime.trailer.id,
            title: "Trailer",
            thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
            url: `https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${anime.trailer.id}`,
            animeTitle: anime.title.romaji || anime.title.english,
          })
          processedIds.add(anime.trailer.id)
        }
      }
    }

    if (trailers.length === 0) return null

    // Return a random trailer
    return trailers[Math.floor(Math.random() * trailers.length)]
  } catch (error) {
    console.error("Error getting random trailer:", error)
    return null
  }
}

// Get multiple random trailers
export async function getMultipleRandomTrailers(count = 5): Promise<VideoItem[]> {
  try {
    const trailers: VideoItem[] = []
    const processedIds = new Set()

    // First, try to get trailers from the dedicated trailer collection
    if (trailersData && trailersData.length > 0) {
      // Shuffle the trailer array
      const shuffledTrailers = [...trailersData].sort(() => 0.5 - Math.random())

      for (const anime of shuffledTrailers) {
        if (
          anime.trailer &&
          anime.trailer.id &&
          anime.trailer.site === "youtube" &&
          !processedIds.has(anime.trailer.id)
        ) {
          trailers.push({
            id: anime.trailer.id,
            title: "Trailer",
            thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
            url: `https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${anime.trailer.id}`,
            animeTitle: anime.title.romaji || anime.title.english,
          })

          processedIds.add(anime.trailer.id)

          // If enough trailers have been collected, return
          if (trailers.length >= count) {
            return trailers
          }
        }
      }
    }

    // If the dedicated trailer collection doesn't have enough data, search other data sources
    const processDataSource = (data: any) => {
      for (const category in data) {
        const animeList = data[category]
        for (const anime of animeList) {
          if (
            anime.trailer &&
            anime.trailer.id &&
            anime.trailer.site === "youtube" &&
            !processedIds.has(anime.trailer.id)
          ) {
            trailers.push({
              id: anime.trailer.id,
              title: "Trailer",
              thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
              url: `https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${anime.trailer.id}`,
              animeTitle: anime.title.romaji || anime.title.english,
            })

            processedIds.add(anime.trailer.id)

            // If enough trailers have been collected, return
            if (trailers.length >= count) {
              return true
            }
          }
        }
      }
      return false
    }

    // Process each data source in order
    if (processDataSource(genresData)) return trailers
    if (processDataSource(formatsData)) return trailers
    if (processDataSource(yearsData)) return trailers
    if (processDataSource(statusData)) return trailers

    return trailers
  } catch (error) {
    console.error("Error getting multiple random trailers:", error)
    return []
  }
}

// Get all trailers
export async function getAllTrailers(): Promise<VideoItem[]> {
  try {
    const trailers: VideoItem[] = []
    const processedIds = new Set()

    // First, get trailers from the dedicated trailer collection
    if (trailersData && trailersData.length > 0) {
      for (const anime of trailersData) {
        if (
          anime.trailer &&
          anime.trailer.id &&
          anime.trailer.site === "youtube" &&
          !processedIds.has(anime.trailer.id)
        ) {
          trailers.push({
            id: anime.trailer.id,
            title: "Trailer",
            thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
            url: `https://www.youtube.com/watch?v=${anime.trailer.id}`,
            animeTitle: anime.title.romaji || anime.title.english,
          })
          processedIds.add(anime.trailer.id)
        }
      }
    }

    // If more trailers are needed, get from other data sources
    const processDataSource = (data: any) => {
      for (const category in data) {
        const animeList = data[category]
        for (const anime of animeList) {
          if (
            anime.trailer &&
            anime.trailer.id &&
            anime.trailer.site === "youtube" &&
            !processedIds.has(anime.trailer.id)
          ) {
            trailers.push({
              id: anime.trailer.id,
              title: "Trailer",
              thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
              url: `https://www.youtube.com/watch?v=${anime.trailer.id}`,
              animeTitle: anime.title.romaji || anime.title.english,
            })
            processedIds.add(anime.trailer.id)
          }
        }
      }
    }

    // Process each data source
    processDataSource(genresData)
    processDataSource(formatsData)
    processDataSource(yearsData)
    processDataSource(statusData)

    return trailers
  } catch (error) {
    console.error("Error getting all trailers:", error)
    return []
  }
}

// Get stats data
export async function getStatsData() {
  try {
    // Calculate the total number of unique anime (using ID to remove duplicates)
    const animeIds = new Set()
    for (const genre in genresData) {
      for (const anime of genresData[genre]) {
        animeIds.add(anime.id)
      }
    }

    const totalAnime = animeIds.size
    const totalGenres = Object.keys(genresData).length

    // Calculate the total number of videos
    const trailers = await getAllTrailers()
    const totalVideos = trailers.length

    return {
      totalAnime,
      totalGenres,
      totalVideos,
    }
  } catch (error) {
    console.error("Error getting stats data:", error)
    return {
      totalAnime: 0,
      totalGenres: 0,
      totalVideos: 0,
    }
  }
}
