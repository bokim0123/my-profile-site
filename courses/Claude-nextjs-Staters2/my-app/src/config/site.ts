import {
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

// 사이트 전역 설정 (Header / Footer / Sidebar / metadata 공용)
export const siteConfig = {
  name: "Next Starter",
  description:
    "Next.js App Router, TypeScript, TailwindCSS, shadcn/ui, lucide-react 기반 모던 웹 스타터킷",
  // Marketing 레이아웃 상단 메뉴
  mainNav: [
    { title: "홈", href: "/" },
    { title: "소개", href: "/about" },
    { title: "예제", href: "/examples" },
    { title: "대시보드", href: "/dashboard" },
  ],
  links: {
    github: "https://github.com",
    nextjs: "https://nextjs.org/docs",
    shadcn: "https://ui.shadcn.com",
  },
} as const

export type NavItem = (typeof siteConfig.mainNav)[number]

export type DashboardNavItem = {
  title: string
  href: string
  icon: LucideIcon
}

// Dashboard 레이아웃 사이드바 메뉴 (그룹 단위)
export const dashboardNav: { label: string; items: DashboardNavItem[] }[] = [
  {
    label: "메인",
    items: [
      { title: "대시보드", href: "/dashboard", icon: LayoutDashboard },
      { title: "사용자", href: "/examples/table", icon: Users },
    ],
  },
  {
    label: "시스템",
    items: [{ title: "설정", href: "/dashboard/settings", icon: Settings }],
  },
]

// Breadcrumb 표시용 경로 이름 (경로 세그먼트 → 표시명)
export const routeLabels: Record<string, string> = {
  dashboard: "대시보드",
  settings: "설정",
}
