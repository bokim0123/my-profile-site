import type { Metadata } from "next"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { ContactForm } from "./_components/contact-form"

export const metadata: Metadata = {
  title: "폼 예제",
}

export default function FormExamplePage() {
  return (
    <Container className="pb-16">
      <PageHeader
        title="폼 예제"
        description="react-hook-form 과 zod 스키마로 입력값을 검증하고 제출하는 예제입니다."
      />
      <ContactForm />
    </Container>
  )
}
