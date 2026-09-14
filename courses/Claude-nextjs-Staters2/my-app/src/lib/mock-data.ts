// 예제 페이지용 목(mock) 데이터

export type UserStatus = "active" | "inactive" | "pending"

export type User = {
  id: number
  name: string
  email: string
  role: "관리자" | "편집자" | "뷰어"
  status: UserStatus
  joinedAt: string // YYYY-MM-DD
}

const names = [
  "김민준", "이서연", "박도윤", "최하은", "정시우", "강지유", "조예준", "윤수아",
  "장하준", "임지아", "한주원", "오서윤", "서은우", "신채원", "권지호", "황다은",
  "안건우", "송유나", "류민재", "홍소율", "전태윤", "고하린", "문현우", "양예린",
]
const roles: User["role"][] = ["관리자", "편집자", "뷰어"]
const statuses: UserStatus[] = ["active", "inactive", "pending"]

// 빌드/렌더마다 동일한 결과가 나오도록 인덱스 기반으로 생성 (hydration 불일치 방지)
export const users: User[] = names.map((name, i) => ({
  id: i + 1,
  name,
  email: `user${String(i + 1).padStart(2, "0")}@example.com`,
  role: roles[i % roles.length],
  status: statuses[(i * 7) % statuses.length],
  joinedAt: `2026-${String((i % 9) + 1).padStart(2, "0")}-${String(((i * 5) % 28) + 1).padStart(2, "0")}`,
}))
