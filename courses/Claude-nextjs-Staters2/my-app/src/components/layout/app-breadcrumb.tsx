"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { routeLabels } from "@/config/site"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// 현재 경로(usePathname)를 세그먼트 단위로 나눠 Breadcrumb 표시
// 라벨은 config/site.ts의 routeLabels 사용, 없으면 세그먼트 원문 표시
export function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/")
          const label = routeLabels[segment] ?? decodeURIComponent(segment)
          const isLast = index === segments.length - 1

          return (
            <Fragment key={href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} />}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
