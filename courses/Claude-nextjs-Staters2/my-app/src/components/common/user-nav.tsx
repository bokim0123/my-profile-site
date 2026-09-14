"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, Settings } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 예제용 사용자 정보 (실제 인증 연동 시 세션 데이터로 대체)
const demoUser = {
  name: "홍길동",
  email: "hong@example.com",
}

// 아바타 + 사용자 드롭다운 메뉴
export function UserNav() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="rounded-full" aria-label="사용자 메뉴" />}
      >
        <Avatar size="sm">
          <AvatarFallback>{demoUser.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="text-sm font-medium text-foreground">{demoUser.name}</p>
            <p className="text-xs font-normal">{demoUser.email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboard /> 대시보드
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
            <Settings /> 설정
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            toast.success("로그아웃되었습니다.")
            router.push("/login")
          }}
        >
          <LogOut /> 로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
