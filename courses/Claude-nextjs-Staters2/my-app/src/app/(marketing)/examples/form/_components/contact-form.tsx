"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const categoryItems = [
  { label: "일반 문의", value: "general" },
  { label: "기술 지원", value: "support" },
  { label: "제휴 제안", value: "partnership" },
]

// 입력값 검증 스키마
const contactSchema = z.object({
  name: z.string().trim().min(2, "이름은 2자 이상 입력해주세요."),
  email: z.email("올바른 이메일 형식이 아닙니다."),
  category: z.string().min(1, "문의 유형을 선택해주세요."),
  message: z
    .string()
    .trim()
    .min(10, "내용은 10자 이상 입력해주세요.")
    .max(500, "내용은 500자 이하로 입력해주세요."),
  agree: z.boolean().refine((value) => value, "개인정보 수집에 동의해주세요."),
})

type ContactFormValues = z.infer<typeof contactSchema>

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  category: "",
  message: "",
  agree: false,
}

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  })

  // React Compiler 사용 시 form.watch 대신 useWatch로 구독
  const messageLength = useWatch({ control: form.control, name: "message" }).length

  async function onSubmit(values: ContactFormValues) {
    // 실제 프로젝트에서는 Server Action 또는 API 호출로 대체
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("submit", values)
    toast.success("문의가 접수되었습니다.", {
      description: `${values.name}님, 빠르게 답변드리겠습니다.`,
    })
    form.reset()
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>문의하기</CardTitle>
        <CardDescription>모든 항목은 필수입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="contact-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-6 sm:grid-cols-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact-name">이름</FieldLabel>
                    <Input
                      {...field}
                      id="contact-name"
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
                    <FieldLabel htmlFor="contact-email">이메일</FieldLabel>
                    <Input
                      {...field}
                      id="contact-email"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contact-category">문의 유형</FieldLabel>
                  <Select
                    items={categoryItems}
                    name={field.name}
                    value={field.value === "" ? null : field.value}
                    onValueChange={(value) => field.onChange(value ?? "")}
                  >
                    <SelectTrigger
                      id="contact-category"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                    >
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contact-message">내용</FieldLabel>
                  <Textarea
                    {...field}
                    id="contact-message"
                    rows={5}
                    placeholder="문의 내용을 입력하세요"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>{messageLength} / 500자</FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="agree"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <Checkbox
                    id="contact-agree"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="contact-agree">
                      개인정보 수집 및 이용에 동의합니다.
                    </FieldLabel>
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="gap-2">
        <Button type="submit" form="contact-form" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Send data-icon="inline-start" />
          )}
          {isSubmitting ? "전송 중..." : "제출"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => form.reset()}
        >
          초기화
        </Button>
      </CardFooter>
    </Card>
  )
}
