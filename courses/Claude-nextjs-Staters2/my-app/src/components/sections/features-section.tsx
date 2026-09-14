import { Code2, Layers, Moon, Paintbrush, Shapes, Zap } from "lucide-react"

import { Section } from "@/components/layout/section"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Zap,
    title: "Next.js App Router",
    description: "Server Components, 파일 기반 라우팅, 레이아웃과 로딩/에러 처리 구성 완료.",
  },
  {
    icon: Code2,
    title: "TypeScript",
    description: "strict 모드와 @/* 경로 별칭으로 안전하고 깔끔한 import.",
  },
  {
    icon: Paintbrush,
    title: "TailwindCSS v4",
    description: "CSS 변수 기반 디자인 토큰으로 일관된 스타일링.",
  },
  {
    icon: Layers,
    title: "shadcn/ui",
    description: "소스 코드로 소유하는 접근성 좋은 UI 컴포넌트.",
  },
  {
    icon: Shapes,
    title: "lucide-react",
    description: "가볍고 일관된 아이콘 세트를 컴포넌트로 바로 사용.",
  },
  {
    icon: Moon,
    title: "다크 모드",
    description: "next-themes 기반 라이트/다크/시스템 테마 전환.",
  },
]

// 기능(기술 스택) 소개 그리드 블록
export function FeaturesSection() {
  return (
    <Section title="포함된 기술 스택">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="mb-2 size-6 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  )
}
