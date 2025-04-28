import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import WeatherProvider from "@/components/weather/weather-provider"
import Live2dWrapper from "@/components/live2d/live2d-wrapper"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Anime Collection",
  description: "Personal anime image and video collection website",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <WeatherProvider>
            {children}
            <Live2dWrapper />
          </WeatherProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
