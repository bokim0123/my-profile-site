"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { dashboardNav } from "@/config/site"
import { Logo } from "@/components/common/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

// "/dashboard"는 하위 경로(/dashboard/settings)에서 중복 활성화되지 않도록 정확히 일치할 때만 활성
function isActiveItem(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href)
}

// Dashboard 레이아웃 좌측 사이드바 (데스크톱: 아이콘 접기 / 모바일: Sheet)
export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  // 모바일 Sheet에서 메뉴 클릭 시 닫기
  function handleNavigate() {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* 아이콘 모드로 접히면 overflow-hidden으로 사이트명이 가려짐 */}
        <Logo
          href="/dashboard"
          onClick={handleNavigate}
          className="h-10 overflow-hidden px-1.5"
        />
      </SidebarHeader>

      <SidebarContent>
        {dashboardNav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActiveItem(pathname, item.href)}
                      tooltip={item.title}
                      render={<Link href={item.href} onClick={handleNavigate} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="홈으로" render={<Link href="/" />}>
              <ArrowLeft />
              <span>홈으로</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
