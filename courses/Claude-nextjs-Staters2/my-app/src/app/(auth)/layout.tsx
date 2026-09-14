import { AuthShell } from "@/components/layout/auth-shell"

// Auth 레이아웃: 로그인/회원가입 등 중앙 카드형 페이지
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>
}
