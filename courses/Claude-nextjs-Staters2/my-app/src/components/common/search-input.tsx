"use client"

import { Search, X } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

// 검색 아이콘 + 지우기 버튼이 포함된 검색 입력
export function SearchInput({
  value,
  onValueChange,
  placeholder = "검색",
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <InputGroup className={className}>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
      {value !== "" && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="검색어 지우기" onClick={() => onValueChange("")}>
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
