import Link from "next/link"

import { Logo } from "@/components/common/logo"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { Container } from "@/components/layout/container"
import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Marketing 레이아웃 상단 헤더 (로고 + 메뉴 + 테마 + 로그인)
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-14 items-center gap-6">
        <Logo />
        <MainNav />
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/login"
            // cn으로 병합해야 buttonVariants의 inline-flex가 hidden으로 대체됨
            className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
          >
            로그인
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
