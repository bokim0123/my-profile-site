# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 📋 프로젝트 개요

**개발자 웹 이력서** — HTML5, CSS3, JavaScript, Tailwind CSS를 활용한 반응형 1페이지 개인 포트폴리오 사이트

자세한 로드맵은 `ROADMAP.md`를 참조하세요.

---

## 🎯 언어 및 커뮤니케이션 규칙

다음 규칙에 따라 한국어 중심으로 진행됩니다:

### 응답 및 문서화
- **기본 응답 언어**: 한국어
- **문서화 & README**: 한국어
- **커밋 메시지**: 한국어 (예: `[feat] 헤더 네비게이션 추가`, `[fix] 다크모드 토글 버그 수정`)

### 코드
- **코드 주석**: 한국어
- **변수명/함수명**: 영어 (코드 표준 및 국제 협업 고려)
- **클래스명**: 영어 (Tailwind 유틸리티도 영어)

#### 예시
```javascript
// 다크모드 토글 함수
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  // 사용자 선택 로컬스토리지에 저장
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
```

---

## 🚀 개발 환경 및 명령어

### 프로젝트 구조

```
developer-resume/
├── index.html              # 메인 HTML 파일
├── css/
│   └── styles.css          # Tailwind CSS 빌드 출력 (또는 CDN 사용)
├── js/
│   └── script.js           # 인터랙션 스크립트
├── assets/
│   └── images/             # 프로필 사진, 아이콘 등
├── README.md
├── ROADMAP.md
├── CLAUDE.md               # 이 파일
└── package.json            # (npm + Tailwind CLI 사용 시)
```

### Tailwind CSS 설정

프로젝트는 **두 가지 방식** 중 선택 가능:

#### Option A: CDN 방식 (빠른 프로토타입)
- `index.html`에 Tailwind CDN 링크만 추가
- 별도 빌드 과정 없음
- 시작이 간단하지만 프로덕션 최적화 제한

```html
<script src="https://cdn.tailwindcss.com"></script>
```

#### Option B: npm + Tailwind CLI (프로덕션)
```bash
# 초기 설정 (한 번만)
npm init -y
npm install -D tailwindcss

# tailwind.config.js 및 input.css 초기화
npx tailwindcss init

# 개발 모드: CSS 감시 & 재빌드
npx tailwindcss -i ./css/input.css -o ./css/styles.css --watch

# 프로덕션 빌드: CSS 최소화
npx tailwindcss -i ./css/input.css -o ./css/styles.css --minify
```

### 로컬 개발 서버

정적 HTML 파일을 개발하므로 간단한 HTTP 서버 필요:

#### Python 내장 서버 (권장)
```bash
# Python 3.x
python -m http.server 8000

# http://localhost:8000 에서 접속
```

#### Node.js Live Server
```bash
# 한 번 설치
npm install -g live-server

# 개발 시 실행
live-server
```

#### VS Code Live Server 확장
- 확장: "Live Server" (ritwickdey 작성)
- 파일 우클릭 → "Open with Live Server"

---

## 🔧 개발 프로세스

### 로드맵 기반 개발

프로젝트는 7단계 **Phase** 시스템으로 진행됩니다 (`ROADMAP.md` 참조):

- **Phase 0**: 환경 설정
- **Phase 1**: 기본 레이아웃 & 헤더
- **Phase 2**: 이력서 섹션 구성 (About, Skills, Experience, Projects, Education, Contact)
- **Phase 3**: 스타일링 & 반응형 디자인
- **Phase 4**: JavaScript 인터랙션 (다크모드, 모바일 메뉴, 스크롤)
- **Phase 5**: 콘텐츠 채우기
- **Phase 6**: 접근성 & 성능 점검
- **Phase 7**: 배포

각 Phase 완료 시 Git 커밋하여 진행 상황 기록.

### Git 커밋 규칙

```
[phase|feat|fix|style|docs] 간단한 설명

예:
[Phase 1] 헤더 및 네비게이션 구조 작성
[feat] 다크모드 토글 JavaScript 구현
[fix] 모바일 메뉴 애니메이션 버그 수정
[style] Tailwind 유틸리티로 컬러 팔레트 적용
[docs] 접근성 점검 항목 완료
```

### 파일 작성 가이드

#### HTML
- 시맨틱 태그 사용 (`<section>`, `<article>`, `<nav>` 등)
- 올바른 헤더 계층 (`<h1>` → `<h2>` → `<h3>`)
- 모든 이미지에 `alt` 속성 필수

#### CSS (Tailwind)
- 모바일 우선 반응형 설계 (`sm:`, `md:`, `lg:` 브레이크포인트)
- 커스텀 CSS는 `css/styles.css`에 작성 (필요한 경우만)
- Tailwind 유틸리티 클래스 최우선 활용

#### JavaScript
- `js/script.js`에 모든 인터랙션 작성
- DOM 쿼리는 `document.querySelector()` 사용
- 이벤트 리스너는 `addEventListener()` 사용
- 로컬스토리지 활용 (다크모드 선택 등 사용자 설정 저장)

---

## 🎨 주요 기술 가이드

### Tailwind CSS 활용
- 색상: `text-gray-600`, `bg-blue-500`, `hover:bg-blue-600` 등
- 반응형: `md:text-lg`, `lg:w-1/2` 등
- 다크모드: `dark:bg-gray-900`, `dark:text-white` 등

### JavaScript 라이브러리
- 외부 라이브러리 최소화 (Vanilla JavaScript 우선)
- 필요 시 경량 라이브러리만 고려 (예: Animate On Scroll 등)

### 성능 최적화
- 이미지 포맷: WebP 또는 최적화된 PNG/JPG
- CSS/JS 최소화: 프로덕션 배포 시 필수
- Lighthouse 점검: Performance, Accessibility, Best Practices, SEO

---

## 📦 배포

### 추천 플랫폼

| 플랫폼 | 설정 난이도 | 특징 |
|--------|-----------|------|
| **GitHub Pages** | ★☆☆ | 무료, GitHub 저장소 연동 |
| **Vercel** | ★☆☆ | 무료, 자동 배포, 빠른 속도 |
| **Netlify** | ★★☆ | 무료, 사용자 친화적, 폼 지원 |

### 배포 전 체크리스트
- [ ] 모든 링크 검증 (내부 링크, 외부 링크)
- [ ] 이미지 모두 로드 확인
- [ ] 반응형 테스트 (모바일, 태블릿, 데스크톱)
- [ ] Lighthouse 점검 완료
- [ ] 접근성 검증

---

## 📚 참고 자료

- [Tailwind CSS 공식 문서](https://tailwindcss.com)
- [MDN - 웹 접근성](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [웹 성능 최적화 팁](https://web.dev/performance/)

---

**마지막 업데이트**: 2026년 8월 3일
