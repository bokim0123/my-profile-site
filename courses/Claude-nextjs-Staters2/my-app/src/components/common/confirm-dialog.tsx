"use client"

import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"

// 삭제/초기화 등 되돌리기 어려운 동작 전 확인 Dialog
// - trigger: 열기 버튼 요소 (예: <Button variant="destructive" />)
// - onConfirm: Promise 반환 시 완료될 때까지 버튼 비활성화 (중복 실행 방지)
export function ConfirmDialog({
  trigger,
  triggerLabel,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  destructive = false,
  onConfirm,
}: {
  trigger: React.ReactElement
  triggerLabel: React.ReactNode
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void | Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleConfirm() {
    setPending(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        // 처리 중에는 닫히지 않도록 유지
        if (!pending) setOpen(nextOpen)
      }}
    >
      <AlertDialogTrigger render={trigger}>{triggerLabel}</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            disabled={pending}
            onClick={handleConfirm}
          >
            {pending && <Spinner data-icon="inline-start" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
