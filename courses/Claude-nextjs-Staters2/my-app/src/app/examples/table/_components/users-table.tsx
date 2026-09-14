"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"

import type { User, UserStatus } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PAGE_SIZE = 8

type SortKey = "name" | "role" | "status" | "joinedAt"
type SortDirection = "asc" | "desc"
type StatusFilter = UserStatus | "all"

const statusLabel: Record<UserStatus, string> = {
  active: "활성",
  inactive: "비활성",
  pending: "대기",
}

const statusVariant: Record<UserStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  inactive: "secondary",
  pending: "outline",
}

const statusFilterItems: { label: string; value: StatusFilter }[] = [
  { label: "전체 상태", value: "all" },
  { label: "활성", value: "active" },
  { label: "비활성", value: "inactive" },
  { label: "대기", value: "pending" },
]

const columns: { key: SortKey; label: string }[] = [
  { key: "name", label: "이름" },
  { key: "role", label: "역할" },
  { key: "status", label: "상태" },
  { key: "joinedAt", label: "가입일" },
]

export function UsersTable({ data }: { data: User[] }) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortKey, setSortKey] = useState<SortKey>("joinedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [page, setPage] = useState(1)

  // 1) 검색 + 상태 필터
  const keyword = query.trim().toLowerCase()
  const filtered = data.filter((user) => {
    const matchesKeyword =
      keyword === "" ||
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesKeyword && matchesStatus
  })

  // 2) 정렬 (원본 배열 변경 방지를 위해 복사 후 정렬)
  const sorted = [...filtered].sort((a, b) => {
    const result = a[sortKey].localeCompare(b[sortKey], "ko")
    return sortDirection === "asc" ? result : -result
  })

  // 3) 페이지네이션 (필터 결과가 줄어도 범위를 벗어나지 않도록 보정)
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 검색 / 필터 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="이름 또는 이메일 검색"
            className="pl-8"
            aria-label="사용자 검색"
          />
        </div>
        <Select
          items={statusFilterItems}
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value ?? "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-36" aria-label="상태 필터">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusFilterItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 데스크톱: 테이블 */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 pl-4">ID</TableHead>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    {sortKey !== column.key ? (
                      <ArrowUpDown className="text-muted-foreground" />
                    ) : sortDirection === "asc" ? (
                      <ArrowUp />
                    ) : (
                      <ArrowDown />
                    )}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center text-muted-foreground">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="pl-4 text-muted-foreground">{user.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[user.status]}>{statusLabel[user.status]}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{user.joinedAt}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 모바일: 카드 리스트 */}
      <div className="flex flex-col gap-2 md:hidden">
        {pageItems.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">검색 결과가 없습니다.</p>
        ) : (
          pageItems.map((user) => (
            <Card key={user.id} size="sm">
              <CardContent className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">
                    {user.name} <span className="text-xs text-muted-foreground">· {user.role}</span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">가입일 {user.joinedAt}</p>
                </div>
                <Badge variant={statusVariant[user.status]}>{statusLabel[user.status]}</Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          총 {sorted.length}명 · {currentPage} / {totalPages} 페이지
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="이전 페이지"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="다음 페이지"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
