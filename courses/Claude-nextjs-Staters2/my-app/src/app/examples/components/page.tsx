import type { Metadata } from "next"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { ComponentShowcase } from "./_components/component-showcase"

export const metadata: Metadata = {
  title: "컴포넌트 쇼케이스",
}

export default function ComponentsExamplePage() {
  return (
    <Container className="pb-16">
      <PageHeader
        title="컴포넌트 쇼케이스"
        description="프로젝트에 포함된 shadcn/ui 컴포넌트의 사용 예시입니다."
      />
      <ComponentShowcase />
    </Container>
  )
}
