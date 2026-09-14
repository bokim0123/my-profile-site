import Link from "next/link"
import { FileQuestion } from "lucide-react"

import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <FileQuestion className="size-12 text-muted-foreground" />
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted-foreground">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/" className={buttonVariants()}>
        홈으로 이동
      </Link>
    </Container>
  )
}
