"use client"

import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type FilterFn,
  type SortFn,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import type { User, UserStatus } from "@/lib/mock-data"
import { DataPagination } from "@/components/common/data-pagination"
import { SearchInput } from "@/components/common/search-input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

// TanStack Table: 필터 → 정렬 → 페이지네이션 순으로 row model 처리
// features / columnDefs는 렌더마다 새로 만들지 않도록 모듈 범위에 둠
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

// 검색어: 이름 또는 이메일에 포함 (대소문자 무시)
const keywordFilterFn: FilterFn<typeof features, User> = (row, _columnId, filterValue) => {
  const keyword = String(filterValue ?? "").trim().toLowerCase()
  const user = row.original
  return (
    keyword === "" ||
    user.name.toLowerCase().includes(keyword) ||
    user.email.toLowerCase().includes(keyword)
  )
}

// 상태 필터: 값이 없으면(전체) TanStack이 필터 자체를 제거하므로 일치 여부만 비교
const statusFilterFn: FilterFn<typeof features, User> = (row, columnId, filterValue) =>
  row.getValue(columnId) === filterValue

// 한글 가나다순 정렬 (내림차순 반전은 TanStack이 처리)
const koreanSortFn: SortFn<typeof features, User> = (rowA, rowB, columnId) =>
  rowA.getValue<string>(columnId).localeCompare(rowB.getValue<string>(columnId), "ko")

const columnHelper = createColumnHelper<typeof features, User>()
const columnDefs = columnHelper.columns([
  columnHelper.accessor("name", { sortFn: koreanSortFn }),
  columnHelper.accessor("email", {}),
  columnHelper.accessor("role", { sortFn: koreanSortFn }),
  columnHelper.accessor("status", { sortFn: koreanSortFn, filterFn: statusFilterFn }),
  columnHelper.accessor("joinedAt", { sortFn: koreanSortFn }),
])

export function UsersTable({ data }: { data: User[] }) {
  const table = useTable({
    features,
    columns: columnDefs,
    data,
    globalFilterFn: keywordFilterFn,
    enableMultiSort: false,
    enableSortingRemoval: false, // asc ↔ desc 토글만 (정렬 해제 없음)
    sortDescFirst: false, // 새 컬럼 클릭 시 오름차순부터
    initialState: {
      sorting: [{ id: "joinedAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: PAGE_SIZE },
    },
  })

  // 화면 표시용 현재 상태 (table.state 구독 → 상태 변경 시 재렌더링)
  const query = String(table.state.globalFilter ?? "")
  const statusFilterValue = table.state.columnFilters.find((filter) => filter.id === "status")?.value
  const statusFilter =
    statusFilterItems.find((item) => item.value === statusFilterValue)?.value ?? "all"
  const currentSort = table.state.sorting[0]

  const pageItems = table.getRowModel().rows.map((row) => row.original)
  const filteredCount = table.getFilteredRowModel().rows.length
  const currentPage = table.state.pagination.pageIndex + 1
  const totalPages = Math.max(1, table.getPageCount())

  function handleSort(key: SortKey) {
    table.getColumn(key)?.toggleSorting()
    table.setPageIndex(0)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 검색 / 필터 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <SearchInput
          value={query}
          onValueChange={(value) => {
            table.setGlobalFilter(value)
            table.setPageIndex(0)
          }}
          placeholder="이름 또는 이메일 검색"
          className="flex-1"
          aria-label="사용자 검색"
        />
        <Select
          items={statusFilterItems}
          value={statusFilter}
          onValueChange={(value) => {
            // "전체"는 필터 값 제거(undefined)로 처리
            table.getColumn("status")?.setFilterValue(value === "all" || value === null ? undefined : value)
            table.setPageIndex(0)
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
                    {currentSort?.id !== column.key ? (
                      <ArrowUpDown className="text-muted-foreground" />
                    ) : !currentSort.desc ? (
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
      <DataPagination
        page={currentPage}
        totalPages={totalPages}
        totalCount={filteredCount}
        unit="명"
        onPageChange={(nextPage) => table.setPageIndex(nextPage - 1)}
      />
    </div>
  )
}
