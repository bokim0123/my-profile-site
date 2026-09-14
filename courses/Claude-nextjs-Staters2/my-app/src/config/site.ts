// 사이트 전역 설정 (Header / Footer / metadata 공용)
export const siteConfig = {
  name: "Next Starter",
  description:
    "Next.js App Router, TypeScript, TailwindCSS, shadcn/ui, lucide-react 기반 모던 웹 스타터킷",
  mainNav: [
    { title: "홈", href: "/" },
    { title: "소개", href: "/about" },
    { title: "예제", href: "/examples" },
  ],
  links: {
    github: "https://github.com",
    nextjs: "https://nextjs.org/docs",
    shadcn: "https://ui.shadcn.com",
  },
} as const

export type NavItem = (typeof siteConfig.mainNav)[number]
