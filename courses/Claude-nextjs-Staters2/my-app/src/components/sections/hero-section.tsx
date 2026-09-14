import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

// 랜딩 페이지 상단 Hero 블록
export function HeroSection() {
  return (
    <section className="border-b">
      <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <Badge variant="secondary">Next.js + shadcn/ui Starter</Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          빠르게 시작하는
          <br className="sm:hidden" /> 모던 웹 스타터킷
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          반복되는 초기 설정은 끝났습니다. 레이아웃, 테마, UI 컴포넌트와 예제
          페이지를 참고해 바로 기능 개발을 시작하세요.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/examples" className={buttonVariants({ size: "lg" })}>
            예제 둘러보기 <ArrowRight />
          </Link>
          <Link href="/about" className={buttonVariants({ size: "lg", variant: "outline" })}>
            스타터킷 소개
          </Link>
        </div>
      </Container>
    </section>
  )
}
