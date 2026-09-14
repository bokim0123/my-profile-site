"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/common/logo"
import { isActivePath } from "@/components/layout/main-nav"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// 모바일 메뉴 (md 미만에서 표시, 링크 클릭 시 닫힘)
export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="메뉴 열기" />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle>
            <Logo onClick={() => setOpen(false)} />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                isActivePath(pathname, item.href) ? "bg-muted font-medium" : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ size: "sm" }), "mt-2")}
          >
            로그인
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
