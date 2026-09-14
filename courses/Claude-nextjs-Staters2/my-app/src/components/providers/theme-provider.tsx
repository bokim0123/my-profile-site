"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

// next-themes Provider 래퍼 (html 요소의 class로 dark 테마 적용)
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
