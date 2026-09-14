import { cn } from "@/lib/utils"

// 각 페이지 상단 제목/설명 영역
export function PageHeader({
  title,
  description,
  className,
  children,
}: {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-2 py-10", className)}>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && (
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  )
}
