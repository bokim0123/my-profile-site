"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

// 보기/숨기기 토글이 포함된 비밀번호 입력 (react-hook-form field spread 호환)
export function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false)

  return (
    <InputGroup className={className}>
      <InputGroupInput type={visible ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
          onClick={() => setVisible((prev) => !prev)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
