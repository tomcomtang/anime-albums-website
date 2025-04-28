import fs from "fs"
import path from "path"
import fetch from "node-fetch"
import { fileURLToPath } from "url"

// Get current file directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// Query specifically for anime with trailers
const TRAILER_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(type: ANIME, sort: POPULARITY_DESC) {
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
        trailer {
          id
          site
          thumbnail
        }
      }
    }
  }
`

async function fetchPage(page, query = ANIME_QUERY) {
  const variables = {
    page,
    perPage: 50,
    sort: ["POPULARITY_DESC"],
  }

  console.log(`Fetching page ${page}...`)

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

function extractMediaData(anime) {
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

async function saveJsonData(category, data) {
  // Create output directory if it doesn't exist
  const outputDir = path.join(process.cwd(), "public", "data")
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Save data to JSON file
  const filePath = path.join(outputDir, `${category}.json`)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  console.log(`Saved ${category} data to ${filePath}`)
}

async function main() {
  try {
    console.log("Starting to fetch anime data from AniList API...")

    // Get total number of pages first
    const initialResponse = await fetchPage(1)
    const totalPages = initialResponse.data.Page.pageInfo.lastPage

    console.log(`Found ${totalPages} pages of anime data to fetch`)

    // Prepare data structures for categorization
    const animeByGenre = {}
    const animeByFormat = {}
    const animeByYear = {}
    const animeByStatus = {}
    const trailersCollection = []

    // Process first page data
    let animeList = initialResponse.data.Page.media
    processAnimeList(animeList, animeByGenre, animeByFormat, animeByYear, animeByStatus)

    // Reduce data volume - only fetch first 5 pages instead of 10
    const maxPages = Math.min(totalPages, 5)

    for (let page = 2; page <= maxPages; page++) {
      const pageData = await fetchPage(page)
      animeList = pageData.data.Page.media
      processAnimeList(animeList, animeByGenre, animeByFormat, animeByYear, animeByStatus)

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Fetch additional anime with trailers - specifically fetch 10 pages of trailers
    console.log("Fetching additional trailers...")
    for (let page = 1; page <= 10; page++) {
      const trailerData = await fetchPage(page, TRAILER_QUERY)
      const trailerList = trailerData.data.Page.media

      // Only keep anime with trailers
      const validTrailers = trailerList.filter(
        (anime) => anime.trailer && anime.trailer.id && anime.trailer.site === "youtube",
      )

      // Add to trailer collection
      validTrailers.forEach((anime) => {
        if (!trailersCollection.some((item) => item.id === anime.id)) {
          trailersCollection.push(extractMediaData(anime))
        }
      })

      console.log(`Fetched ${validTrailers.length} trailers from page ${page}`)

      // Add delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log("Processing and organizing data...")

    // Save trailer collection
    await saveJsonData("trailers", trailersCollection)

    // Save categorized data
    await saveJsonData("genres", animeByGenre)
    await saveJsonData("formats", animeByFormat)
    await saveJsonData("years", animeByYear)
    await saveJsonData("status", animeByStatus)

    console.log("Data fetching and processing complete!")
  } catch (error) {
    console.error("Error fetching anime data:", error)
  }
}

function processAnimeList(animeList, animeByGenre, animeByFormat, animeByYear, animeByStatus) {
  animeList.forEach((anime) => {
    const mediaData = extractMediaData(anime)

    // By genre
    if (anime.genres) {
      anime.genres.forEach((genre) => {
        if (!animeByGenre[genre]) {
          animeByGenre[genre] = []
        }
        animeByGenre[genre].push(mediaData)
      })
    }

    // By format
    if (anime.format) {
      if (!animeByFormat[anime.format]) {
        animeByFormat[anime.format] = []
      }
      animeByFormat[anime.format].push(mediaData)
    }

    // By year
    if (anime.seasonYear) {
      const year = anime.seasonYear.toString()
      if (!animeByYear[year]) {
        animeByYear[year] = []
      }
      animeByYear[year].push(mediaData)
    }

    // By status
    if (anime.status) {
      if (!animeByStatus[anime.status]) {
        animeByStatus[anime.status] = []
      }
      animeByStatus[anime.status].push(mediaData)
    }
  })
}

// Run the main function
main()
