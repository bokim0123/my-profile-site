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
| Utility | clsx + tailwind-merge (`cn()`) |
| Table | @tanstack/react-table v9 (필터 / 정렬 / 페이지네이션) |
| Hooks | usehooks-ts (`useMediaQuery`, `useLocalStorage` 등) |

## 시작하기

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## 레이아웃 / 페이지 구성

Route Group(`(이름)` 폴더)으로 레이아웃을 분리합니다. 폴더명은 URL에 포함되지 않습니다.

| 레이아웃 | 구성 | 경로 |
|---|---|---|
| Root `app/layout.tsx` | html/body, ThemeProvider, TooltipProvider, Toaster | 전체 |
| Marketing `app/(marketing)/layout.tsx` | SiteHeader + main + SiteFooter | `/`, `/about`, `/examples`, `/examples/components`, `/examples/form`, `/examples/table` |
| Auth `app/(auth)/layout.tsx` | AuthShell (로고·테마 + 중앙 카드) | `/login`, `/signup` |
| Dashboard `app/(dashboard)/layout.tsx` | SidebarProvider + AppSidebar + SidebarInset(AppHeader + 본문) | `/dashboard`, `/dashboard/settings` |

- `loading.tsx`, `error.tsx`, `not-found.tsx`는 루트에 있으며 헤더 없이 단독 중앙 화면으로 표시됩니다.
- 인증은 **UI만** 제공합니다 (세션 / 보호 라우트 미포함).
- 새 페이지는 성격에 맞는 그룹 폴더에 만들면 해당 레이아웃이 자동 적용됩니다.
  - 예: `app/(dashboard)/dashboard/orders/page.tsx` → `/dashboard/orders` (사이드바 레이아웃)

## 컴포넌트 계층

의존 방향은 **아래 계층 → 위 계층 import만 허용**합니다. (예: `common`은 `ui`를 사용, `ui`는 `common`을 사용하지 않음)

```
L1 components/ui/          shadcn 원자 컴포넌트 (CLI 관리, 직접 수정 최소화)
L2 components/common/      L1 조합 재사용 컴포넌트 (도메인 무관)
L3 components/layout/      레이아웃 골격 조각 (header / footer / sidebar / nav)
L4 components/sections/    페이지 블록 (Hero, Features, CTA)
L5 app/**/_components/     특정 라우트 전용 컴포넌트
   components/providers/   전역 Provider (계층 외)
```

| 계층 | 컴포넌트 | 용도 |
|---|---|---|
| L2 common | `logo` | 사이트 로고 (Header / Sidebar / Auth 공용) |
| | `theme-toggle` | 라이트 / 다크 / 시스템 전환 |
| | `page-header` | 페이지 제목 / 설명 영역 |
| | `empty-state` | 데이터 없음 표시 |
| | `confirm-dialog` | 삭제 등 확인 Dialog (비동기 처리 중 버튼 비활성화) |
| | `user-nav` | 아바타 + 사용자 드롭다운 메뉴 |
| | `search-input` | 검색 아이콘 + 지우기 버튼 입력 |
| | `password-input` | 비밀번호 보기 / 숨기기 입력 |
| | `stat-card` | 대시보드 지표 카드 |
| | `data-pagination` | 클라이언트 상태 기반 이전 / 다음 페이지네이션 |
| L3 layout | `container`, `section` | 가로 폭 제한 / 세로 구획 |
| | `site-header`, `main-nav`, `mobile-nav`, `site-footer` | Marketing 레이아웃 |
| | `app-sidebar`, `app-header`, `app-breadcrumb` | Dashboard 레이아웃 |
| | `auth-shell` | Auth 레이아웃 |
| L4 sections | `hero-section`, `features-section`, `cta-section` | 랜딩 페이지 블록 |

> barrel(`index.ts`) 파일은 만들지 않습니다. 파일 단위로 직접 import 합니다.

## shadcn/ui 설치 우선순위

| 우선순위 | 목적 | 컴포넌트 | 상태 |
|---|---|---|---|
| P1 핵심 | 모든 웹 공통 | button, input, label, card, dropdown-menu, sheet, sonner, separator, skeleton, avatar, badge | 설치됨 |
| P1 핵심 | 피드백 / 오버레이 | dialog, alert-dialog, tooltip, alert | 설치됨 |
| P2 레이아웃 | 대시보드 / 네비게이션 | sidebar, breadcrumb, scroll-area, collapsible | 설치됨 |
| P3 폼·데이터 | 입력 / 목록 | field, textarea, select, checkbox, switch, table, tabs, radio-group, popover, progress, pagination, empty, spinner, input-group | 설치됨 |
| P4 선택 | 필요 시 설치 | accordion, command, calendar, hover-card, toggle-group, navigation-menu, chart | 미설치 |

```bash
npx shadcn@latest add accordion   # 기존 파일 덮어쓰지 않도록 --overwrite 없이 실행
```

## 개발 가이드

- **사이트 정보 / 메뉴 변경**: `src/config/site.ts`
  - `mainNav`: Marketing 헤더 메뉴
  - `dashboardNav`: 대시보드 사이드바 메뉴 (그룹 / 아이콘)
  - `routeLabels`: 대시보드 Breadcrumb 라벨 (URL 세그먼트 → 표시명)
- **Server / Client 분리**: 페이지는 Server Component로 두고, 상태·이벤트가 필요한 부분만 `_components/`에 `"use client"` 컴포넌트로 분리
- **사이드바 열림 상태**: 쿠키(`sidebar_state`)에 저장되지만 정적 렌더링 유지를 위해 layout에서 읽지 않습니다. 새로고침 시 기본값(열림)으로 시작합니다.

### 유틸리티 라이브러리 원칙

유틸리티는 직접 구현하지 않고 검증된 라이브러리를 사용합니다. (상세 기준: `CLAUDE.md`)

| 용도 | 라이브러리 | 적용 예 |
|---|---|---|
| 클래스 병합 | clsx + tailwind-merge | `src/lib/utils.ts` |
| 테이블 필터 / 정렬 / 페이지네이션 | @tanstack/react-table v9 | `/examples/table` (`users-table.tsx`) |
| 미디어 쿼리 | usehooks-ts `useMediaQuery` | `src/hooks/use-mobile.ts` (사이드바 모바일 전환) |
| 로컬 저장 | usehooks-ts `useLocalStorage` | `/dashboard/settings` 알림 탭 (새로고침 후 유지) |
| 날짜 / 배열·객체 유틸 | date-fns / es-toolkit | 필요 시 설치 |

- SSR 페이지에서 usehooks-ts 훅은 `{ initializeWithValue: false }`로 hydration 불일치를 방지합니다.
- `npx shadcn add`로 추가된 컴포넌트가 `import { cn } from "cn"`을 생성하면 `@/lib/utils`로 변경합니다.

### Base UI 기반 shadcn 사용 시 참고

이 프로젝트의 shadcn 컴포넌트는 Radix가 아닌 **Base UI** 기반입니다.

- 다른 요소로 렌더링할 때 `asChild` 대신 `render` prop 사용
  ```tsx
  <DropdownMenuTrigger render={<Button variant="outline" />}>열기</DropdownMenuTrigger>
  ```
- 링크를 버튼 모양으로 표시할 때는 `buttonVariants` 사용. 클래스를 덧붙일 때는 `cn()`으로 병합 (`buttonVariants({ className })`는 충돌 클래스를 병합하지 않음)
  ```tsx
  <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}>로그인</Link>
  ```
- `Select`에 `items`(label/value 배열)를 전달해야 `SelectValue`에 label이 표시됩니다.
- React Compiler 사용 중이므로 react-hook-form 값 구독은 `form.watch` 대신 `useWatch` 사용
- `ProgressValue`는 실행 환경 locale로 숫자를 포맷하므로 SSR 페이지에서는 값을 직접 표시하는 편이 안전합니다.

> Next.js 16은 이전 버전과 API가 다른 부분이 있습니다. 코드 작성 전 `node_modules/next/dist/docs/`의 문서를 확인하세요.
