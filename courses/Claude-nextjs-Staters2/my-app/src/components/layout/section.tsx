import { Container } from "@/components/layout/container"
import { cn } from "@/lib/utils"

// 페이지 세로 구획 (section + Container + 선택적 제목/설명)
export function Section({
  title,
  description,
  className,
  containerClassName,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  title?: string
  description?: string
  containerClassName?: string
}) {
  return (
    <section className={cn("py-16", className)} {...props}>
      <Container className={containerClassName}>
        {(title || description) && (
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
            {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
