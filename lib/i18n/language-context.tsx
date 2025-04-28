"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Language, getTranslation } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "zh",
  setLanguage: () => {},
  t: (key: string) => key,
})

export const useLanguage = () => useContext(LanguageContext)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh")

  // 从本地存储加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["zh", "en", "ja"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // 保存语言设置到本地存储
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // 翻译函数
  const t = (key: string) => getTranslation(key, language)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
