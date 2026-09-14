"use client" // 에러 바운더리는 Client Component 여야 함

import { useEffect } from "react"
import { TriangleAlert } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // 에러 리포팅 서비스 연동 위치
    console.error(error)
  }, [error])

  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <TriangleAlert className="size-12 text-destructive" />
      <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
      <p className="text-muted-foreground">
        일시적인 오류일 수 있습니다. 다시 시도해주세요.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
      <Button onClick={() => retry()}>다시 시도</Button>
    </Container>
  )
}
