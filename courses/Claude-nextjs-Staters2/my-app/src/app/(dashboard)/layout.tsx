import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Dashboard 레이아웃: 좌측 사이드바 + 상단 바 + 본문
// 사이드바 열림 상태는 쿠키(sidebar_state)에 저장되지만, 정적 렌더링 유지를 위해
// 여기서는 cookies()를 읽지 않고 기본값(열림)으로 시작
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
