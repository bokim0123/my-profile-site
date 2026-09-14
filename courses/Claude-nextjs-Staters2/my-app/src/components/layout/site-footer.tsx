import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Container } from "@/components/layout/container"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <Container className="flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link href={siteConfig.links.nextjs} target="_blank" rel="noreferrer" className="hover:text-foreground">
            Next.js
          </Link>
          <Link href={siteConfig.links.shadcn} target="_blank" rel="noreferrer" className="hover:text-foreground">
            shadcn/ui
          </Link>
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </Link>
        </nav>
      </Container>
    </footer>
  )
}
