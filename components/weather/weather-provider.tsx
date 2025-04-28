"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { Cloud, Sun, Snowflake } from "lucide-react"
import { Button } from "@/components/ui/button"

type WeatherType = "none" | "rain" | "snow" | "sunny"

interface WeatherContextType {
  weatherType: WeatherType
  setWeatherType: (type: WeatherType) => void
}

const WeatherContext = createContext<WeatherContextType>({
  weatherType: "none",
  setWeatherType: () => { },
})

export const useWeather = () => useContext(WeatherContext)

export default function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weatherType, setWeatherType] = useState<WeatherType>("none")
  const [raindrops, setRaindrops] = useState<{ id: number; left: number; delay: number; speed: number }[]>([])
  const [snowflakes, setSnowflakes] = useState<
    { id: number; left: number; delay: number; speed: number; size: number }[]
  >([])
  const [sunRays, setSunRays] = useState<{ id: number; left: number; angle: number; width: number; height: number }[]>(
    [],
  )

  // 初始化天气效果
  useEffect(() => {
    if (weatherType === "rain") {
      const drops = []
      for (let i = 0; i < 100; i++) {
        drops.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          speed: 0.5 + Math.random() * 0.5,
        })
      }
      setRaindrops(drops)
    } else if (weatherType === "snow") {
      const flakes = []
      for (let i = 0; i < 50; i++) {
        flakes.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          speed: 0.2 + Math.random() * 0.3,
          size: 3 + Math.random() * 5,
        })
      }
      setSnowflakes(flakes)
    } else if (weatherType === "sunny") {
      const rays = []
      for (let i = 0; i < 5; i++) {
        rays.push({
          id: i,
          left: 10 + Math.random() * 80,
          angle: Math.random() * 30 - 15,
          width: 50 + Math.random() * 100,
          height: 300 + Math.random() * 500,
        })
      }
      setSunRays(rays)
    }
  }, [weatherType])

  return (
    <WeatherContext.Provider value={{ weatherType, setWeatherType }}>
      <div className="weather-controls">
        <Button
          variant={weatherType === "rain" ? "default" : "outline"}
          size="icon"
          onClick={() => setWeatherType(weatherType === "rain" ? "none" : "rain")}
          title="Rainy"
        >
          <Cloud className="h-4 w-4" />
        </Button>
        <Button
          variant={weatherType === "snow" ? "default" : "outline"}
          size="icon"
          onClick={() => setWeatherType(weatherType === "snow" ? "none" : "snow")}
          title="Snowy"
        >
          <Snowflake className="h-4 w-4" />
        </Button>
        <Button
          variant={weatherType === "sunny" ? "default" : "outline"}
          size="icon"
          onClick={() => setWeatherType(weatherType === "sunny" ? "none" : "sunny")}
          title="Sunny"
        >
          <Sun className="h-4 w-4" />
        </Button>
      </div>

      {weatherType === "rain" && (
        <div className="rain">
          {raindrops.map((drop) => (
            <div
              key={drop.id}
              className="raindrop"
              style={{
                left: `${drop.left}%`,
                top: `-20px`,
                animationName: "rainFall",
                animationDuration: `${drop.speed}s`,
                animationDelay: `${drop.delay}s`,
                animationIterationCount: "infinite",
                animationTimingFunction: "linear",
              }}
            />
          ))}
          <style jsx>{`
            @keyframes rainFall {
              0% {
                transform: translateY(-20px);
              }
              100% {
                transform: translateY(100vh);
              }
            }
          `}</style>
        </div>
      )}

      {weatherType === "snow" && (
        <div className="snow">
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="snowflake"
              style={{
                left: `${flake.left}%`,
                top: `-10px`,
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                animationName: "snowFall",
                animationDuration: `${flake.speed * 10}s`,
                animationDelay: `${flake.delay}s`,
                animationIterationCount: "infinite",
                animationTimingFunction: "linear",
              }}
            />
          ))}
          <style jsx>{`
            @keyframes snowFall {
              0% {
                transform: translateY(-10px) rotate(0deg);
              }
              25% {
                transform: translateY(25vh) translateX(10px) rotate(90deg);
              }
              50% {
                transform: translateY(50vh) translateX(-10px) rotate(180deg);
              }
              75% {
                transform: translateY(75vh) translateX(10px) rotate(270deg);
              }
              100% {
                transform: translateY(100vh) translateX(-10px) rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}

      {weatherType === "sunny" && (
        <div className="sunny">
          {sunRays.map((ray) => (
            <div
              key={ray.id}
              className="sun-ray"
              style={{
                left: `${ray.left}%`,
                top: "0",
                width: `${ray.width}px`,
                height: `${ray.height}px`,
                transform: `rotate(${ray.angle}deg)`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
      )}

      {children}
    </WeatherContext.Provider>
  )
}
