import { useMediaQuery } from "usehooks-ts"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

// 화면 폭이 모바일 기준(768px 미만)인지 여부
// initializeWithValue: false → 서버/hydration 시점은 false, 마운트 후 실제 값 반영 (hydration 불일치 방지)
export function useIsMobile() {
  return useMediaQuery(MOBILE_QUERY, { initializeWithValue: false })
}
