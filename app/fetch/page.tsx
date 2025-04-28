"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { fetchAnimeData } from "@/lib/anilist-api"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function FetchPage() {
  const [isFetching, setIsFetching] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState("")

  const handleFetch = async () => {
    setIsFetching(true)
    setProgress(0)
    setStatus("Initializing...")
    setError("")

    try {
      await fetchAnimeData({
        onProgress: (percent, message) => {
          setProgress(percent)
          setStatus(message)
        },
      })

      setIsComplete(true)
      setStatus("Fetch completed successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Fetch Anime Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isComplete ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="min-h-[60px] p-4 bg-gray-100 rounded-md text-sm">
                <p className="font-mono">{status}</p>
                {error && <p className="text-red-500 mt-2 font-mono">{error}</p>}
              </div>

              <div className="flex justify-center">
                <Button onClick={handleFetch} disabled={isFetching} className="w-full md:w-auto">
                  {isFetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching Data...
                    </>
                  ) : (
                    "Start Fetching"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700">✅ Data fetching completed successfully!</p>
                <p className="text-sm text-green-600 mt-2">
                  JSON configuration files have been generated and organized by categories.
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <Link href="/results">
                  <Button>View Results</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
