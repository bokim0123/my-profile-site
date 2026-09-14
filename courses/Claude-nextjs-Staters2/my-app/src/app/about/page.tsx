import type { Metadata } from "next"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "소개",
}

const folderStructure = `src/
├─ app/                  # App Router (라우트, 레이아웃)
│  ├─ layout.tsx         # 루트 레이아웃 (Theme, Header, Footer, Toaster)
│  ├─ page.tsx           # 랜딩 페이지
│  ├─ loading.tsx        # 전역 로딩 UI
│  ├─ error.tsx          # 전역 에러 바운더리
│  ├─ not-found.tsx      # 404 페이지
│  ├─ about/
│  └─ examples/          # 예제 (components / form / table)
├─ components/
│  ├─ layout/            # Container, SiteHeader, SiteFooter
│  ├─ providers/         # ThemeProvider
│  └─ ui/                # shadcn/ui 컴포넌트
├─ config/site.ts        # 사이트명, 네비게이션 설정
└─ lib/                  # utils(cn), mock-data`

const steps = [
  {
    title: "1. 사이트 정보 수정",
    description: "src/config/site.ts 에서 사이트명, 설명, 네비게이션 메뉴를 변경합니다.",
  },
  {
    title: "2. 페이지 추가",
    description: "src/app/{경로}/page.tsx 파일을 만들면 라우트가 자동 생성됩니다.",
  },
  {
    title: "3. 컴포넌트 추가",
    description: "npx shadcn@latest add {컴포넌트명} 으로 UI 컴포넌트를 추가합니다.",
  },
]

export default function AboutPage() {
  return (
    <Container className="pb-16">
      <PageHeader
        title="스타터킷 소개"
        description="이 프로젝트의 구조와 사용 방법을 안내합니다."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>폴더 구조</CardTitle>
            <CardDescription>주요 디렉터리와 역할</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">
              {folderStructure}
            </pre>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  )
}
