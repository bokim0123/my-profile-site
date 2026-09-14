"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { PasswordInput } from "@/components/common/password-input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const loginSchema = z.object({
  email: z.email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상 입력해주세요."),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginFormValues) {
    // 실제 프로젝트에서는 인증 API 호출 / 세션 저장으로 대체
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast.success("로그인되었습니다.", { description: values.email })
    router.push("/dashboard")
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">로그인</CardTitle>
        <CardDescription>이메일과 비밀번호를 입력하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">이메일</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password">비밀번호</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="login-password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button type="submit" form="login-form" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
        <p className="text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            회원가입
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
