import Link from "next/link"
import { LayoutDashboard } from "lucide-react"

import { Section } from "@/components/layout/section"
import { buttonVariants } from "@/components/ui/button"

// 하단 행동 유도(CTA) 블록
export function CtaSection() {
  return (
    <Section className="border-t bg-muted/40">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">레이아웃까지 준비되어 있습니다</h2>
        <p className="max-w-xl text-muted-foreground">
          Marketing · Dashboard · Auth 레이아웃을 확인하고 필요한 화면부터 바로 만들어 보세요.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
            <LayoutDashboard /> 대시보드 보기
          </Link>
          <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
            로그인 화면 보기
          </Link>
        </div>
      </div>
    </Section>
  )
}
