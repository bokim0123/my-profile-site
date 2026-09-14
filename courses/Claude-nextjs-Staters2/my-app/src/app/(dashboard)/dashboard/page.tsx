import type { Metadata } from "next"
import Link from "next/link"
import { Activity, Bell, CreditCard, UserPlus, Users } from "lucide-react"

import { users } from "@/lib/mock-data"
import { EmptyState } from "@/components/common/empty-state"
import { StatCard } from "@/components/common/stat-card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = {
  title: "대시보드",
}

const statusLabel = { active: "활성", inactive: "비활성", pending: "대기" } as const
const statusVariant = { active: "default", inactive: "secondary", pending: "outline" } as const

// 예제용 목표 달성률
const goals = [
  { label: "월간 신규 가입", value: 72 },
  { label: "활성 사용자 비율", value: 58 },
  { label: "문의 처리율", value: 91 },
]

export default function DashboardPage() {
  const activeCount = users.filter((user) => user.status === "active").length
  const pendingCount = users.filter((user) => user.status === "pending").length
  // 가입일 최신순 5명 (원본 배열 변경 방지를 위해 복사 후 정렬)
  const recentUsers = [...users].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt)).slice(0, 5)

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-sm text-muted-foreground">서비스 현황을 한눈에 확인하세요. (예제 데이터)</p>
      </div>

      {/* 지표 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="전체 사용자" value={users.length} description="누적 가입자 수" icon={Users} />
        <StatCard title="활성 사용자" value={activeCount} description="현재 활성 상태" icon={Activity} />
        <StatCard title="승인 대기" value={pendingCount} description="검토가 필요한 계정" icon={UserPlus} />
        <StatCard title="월 매출" value="₩12,400,000" description="전월 대비 +8.2%" icon={CreditCard} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* 최근 가입 사용자 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>최근 가입 사용자</CardTitle>
            <CardDescription>가입일 기준 최신 5명</CardDescription>
            <CardAction>
              <Link href="/examples/table" className={buttonVariants({ variant: "outline", size: "sm" })}>
                전체 보기
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead className="hidden sm:table-cell">역할</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">가입일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[user.status]}>{statusLabel[user.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{user.joinedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {/* 목표 달성률 */}
          <Card>
            <CardHeader>
              <CardTitle>목표 달성률</CardTitle>
              <CardDescription>이번 달 기준</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {goals.map((goal) => (
                <Progress key={goal.label} value={goal.value}>
                  <ProgressLabel>{goal.label}</ProgressLabel>
                  {/* ProgressValue는 실행 환경 locale로 포맷되므로 hydration 불일치 방지를 위해 직접 표시 */}
                  <span className="ml-auto text-sm text-muted-foreground tabular-nums">{goal.value}%</span>
                </Progress>
              ))}
            </CardContent>
          </Card>

          {/* 빈 상태 예시 */}
          <Card>
            <CardHeader>
              <CardTitle>알림</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState icon={Bell} title="새 알림이 없습니다" description="새로운 활동이 생기면 여기에 표시됩니다." />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
