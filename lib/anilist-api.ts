type ProgressCallback = (percent: number, message: string) => void

interface FetchOptions {
  onProgress?: ProgressCallback
}

// AniList GraphQL API endpoint
const API_URL = "https://graphql.anilist.co"

// GraphQL query to fetch anime data
const ANIME_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(type: ANIME, sort: $sort) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        bannerImage
        genres
        format
        season
        seasonYear
        episodes
        duration
        status
        averageScore
        popularity
        trailer {
          id
          site
          thumbnail
        }
      }
    }
  }
`

export async function fetchAnimeData(options: FetchOptions = {}): Promise<void> {
  const { onProgress = () => {} } = options

  try {
    onProgress(0, "Starting to fetch anime data from AniList API...")

    // Get total number of pages first
    const initialResponse = await fetchPage(1)
    const totalPages = initialResponse.data.Page.pageInfo.lastPage

    onProgress(5, `Found ${totalPages} pages of anime data to fetch`)

    // Prepare data structures for categorization
    const animeByGenre: Record<string, any[]> = {}
    const animeByFormat: Record<string, any[]> = {}
    const animeByYear: Record<string, any[]> = {}
    const animeByStatus: Record<string, any[]> = {}

    // Fetch all pages
    let processedPages = 0

    for (let page = 1; page <= totalPages; page++) {
      onProgress(5 + Math.floor((processedPages / totalPages) * 80), `Fetching page ${page} of ${totalPages}...`)

      const pageData = await fetchPage(page)
      const animeList = pageData.data.Page.media

      // Categorize anime
      animeList.forEach((anime: any) => {
        // By genre
        if (anime.genres) {
          anime.genres.forEach((genre: string) => {
            if (!animeByGenre[genre]) {
              animeByGenre[genre] = []
            }
            animeByGenre[genre].push(extractMediaData(anime))
          })
        }

        // By format
        if (anime.format) {
          if (!animeByFormat[anime.format]) {
            animeByFormat[anime.format] = []
          }
          animeByFormat[anime.format].push(extractMediaData(anime))
        }

        // By year
        if (anime.seasonYear) {
          const year = anime.seasonYear.toString()
          if (!animeByYear[year]) {
            animeByYear[year] = []
          }
          animeByYear[year].push(extractMediaData(anime))
        }

        // By status
        if (anime.status) {
          if (!animeByStatus[anime.status]) {
            animeByStatus[anime.status] = []
          }
          animeByStatus[anime.status].push(extractMediaData(anime))
        }
      })

      processedPages++
    }

    onProgress(85, "Processing and organizing data...")

    // Save categorized data
    await saveJsonData("genres", animeByGenre)
    await saveJsonData("formats", animeByFormat)
    await saveJsonData("years", animeByYear)
    await saveJsonData("status", animeByStatus)

    onProgress(100, "Data fetching and processing complete!")

    return
  } catch (error) {
    console.error("Error fetching anime data:", error)
    throw new Error("Failed to fetch anime data from AniList API")
  }
}

async function fetchPage(page: number): Promise<any> {
  const variables = {
    page,
    perPage: 50,
    sort: ["POPULARITY_DESC"],
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: ANIME_QUERY,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

function extractMediaData(anime: any) {
  // Extract only the media data we need (posters, covers, videos)
  return {
    id: anime.id,
    title: anime.title,
    coverImage: anime.coverImage,
    bannerImage: anime.bannerImage,
    trailer: anime.trailer,
    format: anime.format,
    genres: anime.genres,
    seasonYear: anime.seasonYear,
    episodes: anime.episodes,
  }
}

async function saveJsonData(category: string, data: any): Promise<void> {
  // In a real application, this would save to a file
  // For this demo, we'll store in localStorage in the browser
  if (typeof window !== "undefined") {
    localStorage.setItem(`anilist_${category}`, JSON.stringify(data))
  }

  // This is just a simulation for the demo
  // In a real Node.js script, you would use fs.writeFile
  await new Promise((resolve) => setTimeout(resolve, 500))
}
