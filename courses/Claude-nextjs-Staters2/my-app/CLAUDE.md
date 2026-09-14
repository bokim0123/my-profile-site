@AGENTS.md

# 유틸리티 라이브러리 원칙 ("바퀴를 재발명하지 마라")

유틸리티 기능은 직접 구현하지 않고 **검증된 유명 라이브러리**를 우선 사용합니다.

- 새 유틸리티가 필요하면 먼저 아래 목록에서 찾고, 없으면 npm 주간 다운로드 · 최근 배포일 · TypeScript 지원 · SSR(Next.js) 호환성을 비교해 제안한 뒤 설치합니다.
- `window.matchMedia`, `localStorage` / `sessionStorage`, 디바운스, 클립보드 등 브라우저 API를 감싸는 훅을 직접 만들지 않습니다 → `usehooks-ts` 사용
- 네이티브 API 한두 줄로 충분한 로직(`Array.filter`, `String.padStart` 등)은 라이브러리를 추가하지 않습니다.

| 용도 | 라이브러리 | 비고 |
|---|---|---|
| 클래스 병합 | `clsx` + `tailwind-merge` | `cn()` = `@/lib/utils` |
| 테이블 필터 / 정렬 / 페이지네이션 | `@tanstack/react-table` (v9) | `useTable` + `tableFeatures` 방식 (v8 `useReactTable` 예제 사용 금지) |
| 브라우저 훅 | `usehooks-ts` | `useMediaQuery`, `useLocalStorage`, `useDebounceValue`, `useCopyToClipboard` 등 |
| 폼 / 검증 | `react-hook-form` + `zod` | |
| 날짜 처리 | `date-fns` | 필요 시 설치 |
| 배열 / 객체 유틸 | `es-toolkit` | 필요 시 설치 |

## 사용 시 주의

- `usehooks-ts`의 `useMediaQuery` / `useLocalStorage`는 SSR 페이지에서 `{ initializeWithValue: false }`를 지정합니다. (서버/hydration 시점은 기본값 → 마운트 후 실제 값 반영, hydration 불일치 방지)
- `npx shadcn add`로 추가된 컴포넌트가 `import { cn } from "cn"`을 생성하면 `import { cn } from "@/lib/utils"`로 변경합니다. (`cn` 패키지는 설치하지 않음)
