# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

개인 포트폴리오 및 이력서를 소개하는 현대적이고 반응형 웹 페이지 프로젝트입니다.
기본적인 HTML, CSS, JavaScript와 Tailwind CSS를 사용하여 개발됩니다.

**기술 스택**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS  
**타겟**: 모바일, 태블릿, 데스크톱 반응형 웹사이트

## 언어 및 커뮤니케이션 규칙

### 응답 언어
- **기본 응답 언어**: 한국어
- 모든 설명, 안내문, 커밋 메시지는 한국어로 작성합니다.

### 코드 작성 규칙
- **변수명/함수명**: 영어 (국제 표준 코드 관례 준수)
- **코드 주석**: 한국어로 작성 (이해도를 높이기 위해)
- **문서화**: 한국어로 작성 (README, 개발 가이드 등)
- **커밋 메시지**: 한국어로 작성
- **PR 설명**: 한국어로 작성

## 빌드 및 개발 명령어

### 개발 환경 설정

**의존성 설치**:
```bash
npm install
```

**개발 서버 실행**:
```bash
# VS Code Live Server 확장 사용 (권장)
# 또는 Python 내장 웹 서버
python -m http.server 8000

# Node.js를 사용하는 경우
npx http-server
```

### Tailwind CSS 빌드

**개발 모드 (감시 빌드)**:
```bash
npm run watch:css
```
css/input.css를 모니터링하여 변경사항을 감지하고 css/style.css로 컴파일합니다.

**프로덕션 빌드 (최소화)**:
```bash
npm run build:css
```

**빌드 파이프라인**:
- 입력: `css/input.css` (Tailwind 지시어 포함)
- 처리: PostCSS (Tailwind CSS, Autoprefixer 플러그인)
- 출력: `css/style.css` (최소화된 CSS)

### 프로젝트 구조
```
project-root/
├── index.html                    # 메인 HTML 파일 (포트폴리오 사이트)
├── package.json                  # npm 의존성 설정
├── tailwind.config.js            # Tailwind CSS 설정
├── postcss.config.js             # PostCSS 플러그인 설정 (Tailwind, Autoprefixer)
├── css/
│   ├── input.css                 # Tailwind 지시어 (build 입력)
│   └── style.css                 # 생성된 CSS (build 출력, 최소화)
├── js/
│   └── main.js                   # 기본 스크립트 (모바일 메뉴 토글 등)
├── img/
│   └── [이미지 파일들]           # 프로필, 배경 이미지 등
├── assets/
│   └── [기타 리소스]             # 다운로드 가능한 파일들
├── projects/
│   └── [프로젝트 하위 페이지들]  # 개별 프로젝트 데모 페이지
├── calculator/                   # 계산기 프로젝트 (별도 작업)
├── ROADMAP.md                    # 개발 로드맵
└── .gitignore
```

## 아키텍처 및 개발 방향

### 전체 구조
- **싱글 페이지 웹사이트**: 하나의 index.html과 섹션별 스크롤 네비게이션
- **컴포넌트 방식**: 재사용 가능한 UI 요소는 CSS 클래스 기반으로 구성
- **상태 관리**: 간단한 JavaScript 변수로 테마 상태 관리 (LocalStorage 활용)

### 핵심 섹션
1. **Hero Section**: 자기소개 및 소개글
2. **About**: 경력 요약
3. **Experience**: 회사별 경력 정보
4. **Skills**: 기술 스택
5. **Portfolio**: 프로젝트 포트폴리오
6. **Education**: 학력 및 자격증
7. **Contact**: 연락처 정보

### 개발 원칙

**성능 최우선**
- 외부 라이브러리 최소화 (프레임워크 사용 금지)
- 이미지 최적화 및 Lazy Loading 고려
- CSS-in-JS 패턴 대신 순수 CSS/Tailwind 사용

**접근성**
- 시맨틱 HTML 구조 (header, nav, main, section 등)
- ARIA 레이블 추가 (필요한 곳)
- 색상 대비 충족 및 키보드 네비게이션 지원

**반응형 디자인**
- Mobile-first 접근법 (작은 화면부터 설계)
- Tailwind CSS의 반응형 접두사 활용 (sm:, md:, lg:)
- 모바일(320px), 태블릿(768px), 데스크톱(1024px) 기준

### JavaScript 작성 가이드
- Vanilla JavaScript만 사용 (jQuery 및 프레임워크 제외)
- 파일 구조: 기능별로 별도 파일 구성 (예: main.js는 DOM 조작, 상호작용)
- 이벤트 위임 활용으로 성능 최적화
- `DOMContentLoaded` 이벤트 사용하여 DOM이 준비된 후 스크립트 실행
- ARIA 속성을 통한 접근성 고려 (예: aria-expanded, aria-label)

**현재 구현된 기능**:
- 모바일 메뉴 토글 (main.js)
  - 모바일 환경에서 햄버거 버튼으로 메뉴 토글
  - ARIA 속성으로 스크린 리더 지원
  - 메뉴 항목 클릭 시 자동 닫기

### CSS/Tailwind 규칙
- Tailwind 클래스를 우선으로 사용하여 css/input.css에 작성
- 커스텀 CSS가 필요한 경우만 @layer 지시어로 input.css에 추가
- CSS 변수 활용: :root에서 색상, 간격 등 정의 (Phase 5에서 확정 예정)
- 빌드 과정을 거친 style.css는 수동 편집 금지 (자동 생성 파일)

**Tailwind 사용 팁**:
- 반응형 접두사: `sm:`, `md:`, `lg:` 활용 (sm=640px, md=768px, lg=1024px)
- 다크모드: `dark:` 접두사 사용 (예: `dark:bg-slate-900`)
- 상태 변형: `hover:`, `focus:`, `disabled:` 등으로 상태별 스타일 정의
- 색상 시스템: Tailwind 기본 색상표 활용 (blue-600, slate-200 등)
- Custom 색상이 필요한 경우 tailwind.config.js의 theme.extend.colors에 추가

## 코딩 스타일

### 포매팅
- **들여쓰기**: 2 스페이스
- **라인 길이**: 120자 제한 (가독성)
- **세미콜론**: 사용 (JavaScript)

### 네이밍 컨벤션
- **HTML 클래스**: kebab-case (예: `hero-section`, `btn-primary`)
- **JavaScript 변수/함수**: camelCase (예: `toggleTheme()`, `activeSection`)
- **상수**: UPPER_SNAKE_CASE (예: `SCROLL_DELAY`)

### 커밋 메시지 형식
```
[타입] 간단한 설명

더 상세한 설명이 필요하면 작성
- 변경 사항 1
- 변경 사항 2

Closes #이슈번호 (있는 경우)
```

**타입 예시**:
- feat: 새로운 기능 추가
- fix: 버그 수정
- style: CSS/스타일 변경
- refactor: 코드 리팩토링
- docs: 문서 수정
- perf: 성능 개선
- test: 테스트 추가

## 파일별 책임 범위

| 파일 | 책임 | 수정 시 주의사항 |
|------|------|-----------------|
| `index.html` | 포트폴리오 콘텐츠 및 레이아웃 구조 | 시맨틱 HTML, ARIA 속성 유지 |
| `css/input.css` | 스타일 정의 (Tailwind + 커스텀) | 빌드 필요 (style.css 자동 생성) |
| `js/main.js` | 상호작용 기능 및 이벤트 처리 | 브라우저 호환성, 성능 고려 |
| `tailwind.config.js` | Tailwind CSS 설정 | 컨텐츠 경로 구성 유지 |
| `postcss.config.js` | PostCSS 플러그인 설정 | Autoprefixer 필수 포함 |
| `projects/` | 개별 프로젝트 데모 페이지 | 별도 HTML/CSS/JS 구성 가능 |

## 개발 워크플로우

1. **기능 브랜치 생성**: `git checkout -b feature/섹션명`
2. **개발 진행**:
   - `npm run watch:css` 실행 (터미널 1)
   - Live Server로 실시간 브라우저 확인 (터미널 2)
3. **커밋**: 의미 있는 단위로 커밋
4. **테스트**: 모든 브라우저에서 확인
   - 데스크톱: Chrome, Firefox, Safari, Edge
   - 모바일: Chrome DevTools 모바일 에뮬레이션 (F12 → 기기 토글)
   - 다크모드: 브라우저 설정에서 다크 테마 적용
5. **병합**: main 브랜치로 PR 생성 후 병합

## 테스트 및 디버깅

### 브라우저 테스팅
- **반응형 테스트**: Chrome DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)
- **다크모드 테스트**: 시스템 다크 테마 적용 또는 브라우저 개발자 도구에서 CSS 미디어 쿼리 시뮬레이션
- **네트워크 테스트**: Throttling 설정으로 느린 네트워크 환경 시뮬레이션

### 접근성 검증
- **키보드 네비게이션**: Tab 키로 모든 상호작용 요소 접근 가능 확인
- **스크린 리더**: ARIA 속성 정상 작동 확인 (예: aria-expanded, aria-label)
- **색상 대비**: Lighthouse 또는 WebAIM 도구로 WCAG 기준 검증

### 성능 측정
- Chrome DevTools Lighthouse (F12 → Lighthouse)
- 목표: Performance 90점 이상, Accessibility 95점 이상

## 현재 개발 상태

**완료한 단계**: Phase 1 (기본 레이아웃 구축)
- 반응형 그리드 레이아웃
- Hero 섹션 및 기본 네비게이션 바
- 모바일 메뉴 (햄버거 버튼)
- Tailwind CSS 기본 설정

**진행 중인 단계**: Phase 2 (주요 섹션 개발)
- About, Experience, Skills 섹션 구현

**주의사항**:
- `projects/` 디렉토리는 개별 프로젝트 데모용 (메인 포트폴리오와 분리)
- `calculator/` 디렉토리는 별도 프로젝트 (포트폴리오 사이트와 무관)
- Puppeteer 의존성: 향후 PDF 다운로드 기능(Phase 7)에서 사용 예정

## 새로운 기능 추가 시 체크리스트

- [ ] ROADMAP.md에서 해당 작업 항목 확인
- [ ] HTML 구조 작성 (시맨틱 마크업, ARIA 속성)
- [ ] css/input.css에 Tailwind 클래스 및 커스텀 CSS 추가
- [ ] 필요시 js/main.js에 이벤트 처리 로직 추가
- [ ] `npm run watch:css` 실행하여 CSS 컴파일 확인
- [ ] Live Server로 실시간 결과 확인
- [ ] 모바일(320px), 태블릿(768px), 데스크톱(1024px+)에서 테스트
- [ ] 다크모드 상태에서도 시각적 오류 없는지 확인
- [ ] 키보드 네비게이션 및 접근성 검토
- [ ] Lighthouse 점수 확인 (성능 90+, 접근성 95+)
- [ ] 의미 있는 메시지로 커밋 및 ROADMAP.md 업데이트
