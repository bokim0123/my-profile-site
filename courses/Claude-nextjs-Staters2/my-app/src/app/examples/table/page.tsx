import type { Metadata } from "next"

import { users } from "@/lib/mock-data"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { UsersTable } from "./_components/users-table"

export const metadata: Metadata = {
  title: "테이블 / 리스트 예제",
}

export default function TableExamplePage() {
  // 서버에서 데이터를 조회해 클라이언트 컴포넌트로 전달하는 패턴
  return (
    <Container className="pb-16">
      <PageHeader
        title="테이블 / 리스트 예제"
        description="검색, 상태 필터, 컬럼 정렬, 페이지네이션 예제입니다. 모바일에서는 카드 리스트로 표시됩니다."
      />
      <UsersTable data={users} />
    </Container>
  )
}
