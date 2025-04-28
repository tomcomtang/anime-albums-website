"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { getCategories, getCategoryData } from "@/lib/data-manager"

export default function ResultsPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [categoryData, setCategoryData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
        if (cats.length > 0) {
          setActiveCategory(cats[0])
        }
      } catch (error) {
        console.error("Failed to load categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    const loadCategoryData = async () => {
      if (!activeCategory) return

      try {
        setIsLoading(true)
        const data = await getCategoryData(activeCategory)
        setCategoryData(data)
      } catch (error) {
        console.error(`Failed to load data for category ${activeCategory}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategoryData()
  }, [activeCategory])

  const handleDownload = () => {
    if (!categoryData) return

    const dataStr = JSON.stringify(categoryData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${activeCategory}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="flex min-h-screen flex-col p-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generated JSON Configuration Files</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && categories.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500">No data has been fetched yet.</p>
                <Link href="/fetch" className="mt-4 inline-block">
                  <Button>Fetch Anime Data</Button>
                </Link>
              </div>
            ) : (
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="overflow-x-auto">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <Button variant="outline" size="sm" onClick={handleDownload} disabled={!categoryData}>
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                </div>

                {categories.map((category) => (
                  <TabsContent key={category} value={category} className="border rounded-md p-4">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <p>Loading data...</p>
                      </div>
                    ) : (
                      <div className="overflow-auto max-h-[500px]">
                        <pre className="text-xs">{JSON.stringify(categoryData, null, 2)}</pre>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
