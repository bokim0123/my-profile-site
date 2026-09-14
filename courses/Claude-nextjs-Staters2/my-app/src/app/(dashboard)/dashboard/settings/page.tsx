import type { Metadata } from "next"

import { SettingsTabs } from "./_components/settings-tabs"

export const metadata: Metadata = {
  title: "설정",
}

export default function SettingsPage() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">설정</h1>
        <p className="text-sm text-muted-foreground">프로필, 알림, 계정 설정을 관리합니다. (예제)</p>
      </div>
      <SettingsTabs />
    </>
  )
}
