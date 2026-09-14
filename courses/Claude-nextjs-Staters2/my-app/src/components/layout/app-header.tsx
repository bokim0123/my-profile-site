import { ThemeToggle } from "@/components/common/theme-toggle"
import { UserNav } from "@/components/common/user-nav"
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Dashboard 레이아웃 상단 바 (사이드바 토글 + Breadcrumb + 테마 + 사용자 메뉴)
export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <AppBreadcrumb />
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  )
}
