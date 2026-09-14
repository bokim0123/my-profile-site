import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

// 화면 폭 변경(matchMedia change) 구독
function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

// 원본(shadcn)은 useEffect 내부 setState 방식이라 react-hooks/set-state-in-effect 규칙에 걸려
// 동일 동작의 useSyncExternalStore로 변경 (서버/hydration 시점 값은 원본과 같이 false)
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false
  )
}
