'use client'
import { FiSun, FiMoon } from "react-icons/fi"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from "next/image"

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "i") {
        event.preventDefault()
        setTheme(resolvedTheme === "light" ? "dark" : "light")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mounted, resolvedTheme, setTheme])

  if (!mounted) return (
    <Image
      src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
      width={36}
      height={36}
      sizes="36x36"
      alt="Loading Light/Dark Toggle"
      priority={false}
      title="Loading Light/Dark Toggle"
    />
  )

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  if (resolvedTheme === 'dark') {
    return (
      <FiSun 
      title="ctrl + i"
      className="dark:text-white text-[--Background] hover:text-[--mainText] hover:dark:text-[--mainText] text-3xl sm:text-2xl transition-all duration-300"
      onClick={() => handleThemeChange('light')} 
      />
    )
  }
  
  if (resolvedTheme === 'light') {
    return (
      <FiMoon 
      title="ctrl + i"
        className="text-black dark:text-[--Background] hover:text-[--mainText] hover:dark:text-[--mainText] text-3xl sm:text-2xl transition-all duration-300" 
        onClick={() => handleThemeChange('dark')} 
      />
    )
  }
}
