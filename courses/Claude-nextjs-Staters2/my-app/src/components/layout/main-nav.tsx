"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

// 현재 경로가 메뉴 항목에 해당하는지 판단 ("/"는 정확히 일치할 때만)
export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

// 데스크톱 메인 네비게이션 (md 이상에서 표시)
export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={cn("hidden items-center gap-1 md:flex", className)}>
      {siteConfig.mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground",
            isActivePath(pathname, item.href)
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
