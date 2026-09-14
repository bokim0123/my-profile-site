# Next Starter

Next.js App Router 기반으로 바로 기능 개발을 시작할 수 있는 모던 웹 스타터킷입니다.

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS v4 |
| UI | shadcn/ui (base-nova 스타일, Base UI 기반) |
| Icon | lucide-react |
| Theme | next-themes (라이트 / 다크 / 시스템) |
| Form | react-hook-form + zod |
| Toast | sonner |

## 시작하기

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## 페이지 구성

| 경로 | 설명 |
|---|---|
| `/` | 랜딩 페이지 (Hero + 기술 스택 소개) |
| `/about` | 폴더 구조 및 사용 방법 안내 |
| `/examples` | 예제 목록 |
| `/examples/components` | UI 컴포넌트 쇼케이스 |
| `/examples/form` | react-hook-form + zod 검증 폼 |
| `/examples/table` | 검색 / 필터 / 정렬 / 페이지네이션 테이블 (모바일은 카드 리스트) |

`loading.tsx`, `error.tsx`, `not-found.tsx`로 전역 로딩 / 에러 / 404 화면이 구성되어 있습니다.

## 폴더 구조

```
src/
├─ app/                     # 라우트 (App Router)
│  ├─ layout.tsx            # 루트 레이아웃: ThemeProvider, Header, Footer, Toaster
│  ├─ page.tsx
│  ├─ loading.tsx / error.tsx / not-found.tsx
│  ├─ about/
│  └─ examples/
│     ├─ components/_components/   # 라우트 전용 Client Component
│     ├─ form/_components/
│     └─ table/_components/
├─ components/
│  ├─ layout/               # Container, SiteHeader, SiteFooter
│  ├─ providers/            # ThemeProvider
│  ├─ ui/                   # shadcn/ui 컴포넌트 (CLI로 추가)
│  ├─ page-header.tsx
│  └─ theme-toggle.tsx
├─ config/site.ts           # 사이트명, 설명, 네비게이션 메뉴
└─ lib/
   ├─ utils.ts              # cn() 클래스 병합 유틸
   └─ mock-data.ts          # 예제용 목 데이터
```

## 개발 가이드

- **사이트 정보 / 메뉴 변경**: `src/config/site.ts` 수정 → Header, Footer, metadata에 반영
- **페이지 추가**: `src/app/{경로}/page.tsx` 생성 후 필요하면 `siteConfig.mainNav`에 메뉴 추가
- **UI 컴포넌트 추가**: `npx shadcn@latest add {컴포넌트명}`
- **Server / Client 분리**: 페이지는 Server Component로 두고, 상태·이벤트가 필요한 부분만 `_components/`에 `"use client"` 컴포넌트로 분리

### Base UI 기반 shadcn 사용 시 참고

이 프로젝트의 shadcn 컴포넌트는 Radix가 아닌 **Base UI** 기반입니다.

- 다른 요소로 렌더링할 때 `asChild` 대신 `render` prop 사용
  ```tsx
  <DropdownMenuTrigger render={<Button variant="outline" />}>열기</DropdownMenuTrigger>
  ```
- 링크를 버튼 모양으로 표시할 때는 `buttonVariants` 사용
  ```tsx
  <Link href="/examples" className={buttonVariants({ variant: "outline" })}>예제</Link>
  ```
- `Select`에 `items`(label/value 배열)를 전달해야 `SelectValue`에 label이 표시됩니다.
- React Compiler 사용 중이므로 react-hook-form 값 구독은 `form.watch` 대신 `useWatch` 사용

> Next.js 16은 이전 버전과 API가 다른 부분이 있습니다. 코드 작성 전 `node_modules/next/dist/docs/`의 문서를 확인하세요.
