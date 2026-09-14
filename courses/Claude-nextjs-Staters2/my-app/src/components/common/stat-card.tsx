import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// 대시보드 지표 카드 (제목 / 값 / 보조 설명 / 아이콘)
export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
}: {
  title: string
  value: React.ReactNode
  description?: React.ReactNode
  icon?: LucideIcon
  className?: string
}) {
  return (
    <Card size="sm" className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
