import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 조건부 클래스 조합(clsx) + Tailwind 충돌 클래스 병합(tailwind-merge)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
