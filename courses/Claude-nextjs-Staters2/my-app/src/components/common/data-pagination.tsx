"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 클라이언트 상태 기반 목록용 페이지네이션 (이전/다음 + 페이지 정보)
// URL 기반 페이지 이동이 필요하면 ui/pagination(링크형)을 사용
export function DataPagination({
  page,
  totalPages,
  totalCount,
  unit = "건",
  onPageChange,
  className,
}: {
  page: number
  totalPages: number
  totalCount?: number
  unit?: string
  onPageChange: (page: number) => void
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between text-sm text-muted-foreground", className)}>
      <p>
        {totalCount !== undefined && `총 ${totalCount}${unit} · `}
        {page} / {totalPages} 페이지
      </p>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="다음 페이지"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
