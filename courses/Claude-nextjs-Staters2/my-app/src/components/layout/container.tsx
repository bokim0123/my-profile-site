import { cn } from "@/lib/utils"

// 페이지 콘텐츠 폭/좌우 여백을 통일하는 래퍼
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  )
}
