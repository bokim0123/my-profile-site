import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Layers,
  Moon,
  Paintbrush,
  Shapes,
  Zap,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
];

export default function Home() {
  return (
    <>
      {/* Hero */}
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
            <Link
              href="/about"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              스타터킷 소개
            </Link>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section>
        <Container className="py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">
            포함된 기술 스택
          </h2>
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
        </Container>
      </section>
    </>
  );
}
