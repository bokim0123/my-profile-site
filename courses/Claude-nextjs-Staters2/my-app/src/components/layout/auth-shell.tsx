import { Logo } from "@/components/common/logo"
import { ThemeToggle } from "@/components/common/theme-toggle"

// Auth 레이아웃 골격 (상단 로고/테마 + 화면 중앙 폼 영역)
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-muted/40">
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  )
}
