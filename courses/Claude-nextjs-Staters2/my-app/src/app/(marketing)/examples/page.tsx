import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, LayoutGrid, SquarePen, Table2 } from "lucide-react"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/common/page-header"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "예제",
}

const examples = [
  {
    href: "/examples/components",
    icon: LayoutGrid,
    title: "컴포넌트 쇼케이스",
    description: "Button, Badge, Card, Tabs, Dropdown, Sheet, Toast 등 UI 컴포넌트 모음",
  },
  {
    href: "/examples/form",
    icon: SquarePen,
    title: "폼 예제",
    description: "react-hook-form + zod 스키마 검증과 제출 처리",
  },
  {
    href: "/examples/table",
    icon: Table2,
    title: "테이블 / 리스트 예제",
    description: "검색, 정렬, 페이지네이션이 포함된 데이터 테이블",
  },
]

export default function ExamplesPage() {
  return (
    <Container className="pb-16">
      <PageHeader
        title="예제"
        description="자주 사용하는 화면 패턴을 참고용으로 구현했습니다."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {examples.map((example) => (
          <Link key={example.href} href={example.href} className="group">
            <Card className="h-full transition-colors group-hover:bg-muted/50">
              <CardHeader>
                <example.icon className="mb-2 size-6 text-primary" />
                <CardTitle className="flex items-center gap-1">
                  {example.title}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  )
}
