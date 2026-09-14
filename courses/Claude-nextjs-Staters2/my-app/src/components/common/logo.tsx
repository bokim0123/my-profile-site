import Link from "next/link"
import { Rocket } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

// 사이트 로고 (Header / Sidebar / Auth 공용)
export function Logo({
  href = "/",
  showName = true,
  className,
  onClick,
}: {
  href?: string
  showName?: boolean
  className?: string
  onClick?: () => void
}) {
  return (
    <Link href={href} onClick={onClick} className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Rocket className="size-4" />
      </span>
      {showName && <span className="truncate">{siteConfig.name}</span>}
    </Link>
  )
}
