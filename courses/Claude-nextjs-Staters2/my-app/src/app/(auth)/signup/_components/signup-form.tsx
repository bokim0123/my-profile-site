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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "이름은 2자 이상 입력해주세요."),
    email: z.email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(8, "비밀번호는 8자 이상 입력해주세요."),
    confirmPassword: z.string().min(1, "비밀번호를 한 번 더 입력해주세요."),
    terms: z.boolean().refine((value) => value, "이용약관에 동의해주세요."),
  })
  // 비밀번호 확인 불일치 시 confirmPassword 필드에 에러 표시
  .refine((values) => values.password === values.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false },
  })

  async function onSubmit(values: SignupFormValues) {
    // 실제 프로젝트에서는 회원가입 API 호출로 대체
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast.success("회원가입이 완료되었습니다.", { description: `${values.name}님, 환영합니다.` })
    router.push("/login")
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">회원가입</CardTitle>
        <CardDescription>계정 정보를 입력하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-name">이름</FieldLabel>
                  <Input
                    {...field}
                    id="signup-name"
                    placeholder="홍길동"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-email">이메일</FieldLabel>
                  <Input
                    {...field}
                    id="signup-email"
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
                  <FieldLabel htmlFor="signup-password">비밀번호</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="signup-password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-confirm-password">비밀번호 확인</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="signup-confirm-password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="terms"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <Checkbox
                    id="signup-terms"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="signup-terms">이용약관 및 개인정보 처리방침에 동의합니다.</FieldLabel>
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button type="submit" form="signup-form" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {isSubmitting ? "가입 중..." : "회원가입"}
        </Button>
        <p className="text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            로그인
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
