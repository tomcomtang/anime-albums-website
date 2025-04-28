"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-4 w-4" />
          <span className="sr-only">切换语言</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("zh")} className={language === "zh" ? "bg-muted" : ""}>
          中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ja")} className={language === "ja" ? "bg-muted" : ""}>
          日本語
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
