import type { Metadata } from "next"

import { SignupForm } from "./_components/signup-form"

export const metadata: Metadata = {
  title: "회원가입",
}

export default function SignupPage() {
  return <SignupForm />
}
