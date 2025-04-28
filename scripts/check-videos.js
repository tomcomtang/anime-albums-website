import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 检查本地视频文件
async function checkLocalVideos() {
  try {
    const localVideosPath = path.join(process.cwd(), "public", "data", "local-videos.json")

    // 如果本地视频文件不存在，创建一个空数组
    if (!fs.existsSync(localVideosPath)) {
      fs.writeFileSync(localVideosPath, JSON.stringify([], null, 2))
      console.log(`Created empty local-videos.json at ${localVideosPath}`)
      return
    }

    // 读取本地视频信息
    const localVideos = JSON.parse(fs.readFileSync(localVideosPath, "utf8"))
    console.log(`Found ${localVideos.length} local videos in the JSON file`)

    // 验证每个视频文件是否存在
    const validVideos = []
    const invalidVideos = []

    for (const video of localVideos) {
      const videoPath = path.join(process.cwd(), "public", video.videoPath)

      if (fs.existsSync(videoPath)) {
        console.log(`✅ Video exists: ${video.videoPath}`)
        // 检查文件大小
        const stats = fs.statSync(videoPath)
        const fileSizeInMB = stats.size / (1024 * 1024)
        console.log(`   File size: ${fileSizeInMB.toFixed(2)} MB`)
        validVideos.push(video)
      } else {
        console.log(`❌ Video missing: ${video.videoPath}`)
        invalidVideos.push(video)
      }

      // 检查缩略图
      if (video.thumbnailPath) {
        const thumbnailPath = path.join(process.cwd(), "public", video.thumbnailPath)
        if (fs.existsSync(thumbnailPath)) {
          console.log(`✅ Thumbnail exists: ${video.thumbnailPath}`)
        } else {
          console.log(`❌ Thumbnail missing: ${video.thumbnailPath}`)
        }
      }
    }

    // 更新本地视频信息，只保留有效的视频
    if (invalidVideos.length > 0) {
      console.log(`\n⚠️ Found ${invalidVideos.length} invalid videos:`)
      invalidVideos.forEach((video) => {
        console.log(`   - ${video.title} (${video.videoPath})`)
      })

      fs.writeFileSync(localVideosPath, JSON.stringify(validVideos, null, 2))
      console.log(`\n✅ Updated local-videos.json with ${validVideos.length} valid videos`)
    } else {
      console.log(`\n✅ All ${validVideos.length} videos are valid!`)
    }

    // 检查视频目录结构
    const videosDir = path.join(process.cwd(), "public", "videos")
    const thumbnailsDir = path.join(process.cwd(), "public", "thumbnails")

    console.log("\n📁 Directory structure check:")
    if (fs.existsSync(videosDir)) {
      console.log(`✅ Videos directory exists: ${videosDir}`)
      const files = fs.readdirSync(videosDir)
      console.log(`   Contains ${files.length} files`)
    } else {
      console.log(`❌ Videos directory missing: ${videosDir}`)
      console.log(`   Creating directory...`)
      fs.mkdirSync(videosDir, { recursive: true })
    }

    if (fs.existsSync(thumbnailsDir)) {
      console.log(`✅ Thumbnails directory exists: ${thumbnailsDir}`)
      const files = fs.readdirSync(thumbnailsDir)
      console.log(`   Contains ${files.length} files`)
    } else {
      console.log(`❌ Thumbnails directory missing: ${thumbnailsDir}`)
      console.log(`   Creating directory...`)
      fs.mkdirSync(thumbnailsDir, { recursive: true })
    }
  } catch (error) {
    console.error("Error checking local videos:", error)
  }
}

// 运行检查
checkLocalVideos()
