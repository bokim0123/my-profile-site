"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const notificationItems = [
  { id: "notify-email", label: "이메일 알림", description: "중요 공지와 보안 알림을 이메일로 받습니다." },
  { id: "notify-marketing", label: "마케팅 정보", description: "새 기능과 이벤트 소식을 받습니다." },
]

const frequencyItems = [
  { value: "realtime", label: "실시간" },
  { value: "daily", label: "하루 한 번 요약" },
  { value: "weekly", label: "주간 요약" },
]

export function SettingsTabs() {
  const router = useRouter()
  const [frequency, setFrequency] = useState("realtime")

  async function handleDeleteAccount() {
    // 실제 프로젝트에서는 계정 삭제 API 호출로 대체
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("계정이 삭제되었습니다. (예제)")
    router.push("/")
  }

  return (
    <Tabs defaultValue="profile" className="max-w-2xl">
      <TabsList>
        <TabsTrigger value="profile">프로필</TabsTrigger>
        <TabsTrigger value="notifications">알림</TabsTrigger>
        <TabsTrigger value="account">계정</TabsTrigger>
      </TabsList>

      {/* 프로필 */}
      <TabsContent value="profile" className="pt-2">
        <Card>
          <CardHeader>
            <CardTitle>프로필</CardTitle>
            <CardDescription>다른 사용자에게 표시되는 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="settings-name">이름</FieldLabel>
                <Input id="settings-name" defaultValue="홍길동" autoComplete="name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="settings-email">이메일</FieldLabel>
                <Input id="settings-email" type="email" defaultValue="hong@example.com" autoComplete="email" />
                <FieldDescription>이메일 변경 시 인증 메일이 발송됩니다.</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success("프로필이 저장되었습니다.")}>저장</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* 알림 */}
      <TabsContent value="notifications" className="pt-2">
        <Card>
          <CardHeader>
            <CardTitle>알림</CardTitle>
            <CardDescription>받을 알림과 수신 주기를 선택하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {notificationItems.map((item) => (
                <Field key={item.id} orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor={item.id}>{item.label}</FieldLabel>
                    <FieldDescription>{item.description}</FieldDescription>
                  </FieldContent>
                  <Switch id={item.id} defaultChecked={item.id === "notify-email"} />
                </Field>
              ))}
              <FieldSet>
                <FieldLegend variant="label">수신 주기</FieldLegend>
                <RadioGroup value={frequency} onValueChange={(value) => setFrequency(String(value))}>
                  {frequencyItems.map((item) => (
                    <Field key={item.value} orientation="horizontal">
                      <RadioGroupItem id={`frequency-${item.value}`} value={item.value} />
                      <FieldLabel htmlFor={`frequency-${item.value}`} className="font-normal">
                        {item.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
              </FieldSet>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success("알림 설정이 저장되었습니다.")}>저장</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* 계정 */}
      <TabsContent value="account" className="pt-2">
        <Card>
          <CardHeader>
            <CardTitle>계정</CardTitle>
            <CardDescription>계정 삭제는 되돌릴 수 없습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Trash2 />
              <AlertTitle>위험 구역</AlertTitle>
              <AlertDescription>계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <ConfirmDialog
              trigger={<Button variant="destructive" />}
              triggerLabel="계정 삭제"
              title="정말 계정을 삭제하시겠습니까?"
              description="이 작업은 되돌릴 수 없으며 모든 데이터가 삭제됩니다."
              confirmLabel="삭제"
              destructive
              onConfirm={handleDeleteAccount}
            />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
