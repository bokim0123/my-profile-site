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
```bash
# 로컬 개발 서버 실행 (간단한 HTTP 서버)
# VS Code의 Live Server 확장 사용 권장
```

### Tailwind CSS 빌드
```bash
# Tailwind CSS 초기화 (프로젝트 시작 시)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 개발 중 Tailwind CSS 감시 빌드
npm run build:css -- --watch

# 프로덕션 빌드 (최소화)
npm run build:css
```

### 프로젝트 구조
```
project-root/
├── index.html                 # 메인 HTML 파일
├── css/
│   ├── style.css             # 커스텀 CSS (Tailwind로 생성)
│   └── tailwind.config.js    # Tailwind 설정
├── js/
│   ├── main.js               # 기본 스크립트 (DOM 조작, 이벤트)
│   ├── theme.js              # 다크모드/라이트모드 전환
│   └── scroll.js             # 스크롤 애니메이션 및 네비게이션
├── img/
│   ├── profile.jpg           # 프로필 이미지
│   └── projects/             # 프로젝트 이미지
├── assets/
│   └── resume.pdf            # PDF 버전 이력서
├── README.md
├── ROADMAP.md
├── package.json
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
- 모듈화: 기능별로 별도 파일로 구분 (main.js, theme.js, scroll.js 등)
- 이벤트 위임 활용으로 성능 최적화
- 공통 유틸리티 함수는 별도 파일로 관리

### CSS/Tailwind 규칙
- Tailwind 클래스 우선 사용
- 커스텀 CSS가 필요한 경우 style.css에 작성
- CSS 변수 활용: 색상, 간격, 폰트 크기 등

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

## 개발 워크플로우

1. **기능 브랜치 생성**: `git checkout -b feature/섹션명`
2. **개발 진행**: Live Server로 실시간 확인
3. **커밋**: 의미 있는 단위로 커밋
4. **테스트**: 모든 브라우저에서 확인
   - 데스크톱: Chrome, Firefox, Safari, Edge
   - 모바일: Chrome DevTools 모바일 에뮬레이션
5. **병합**: main 브랜치로 PR 생성 후 병합

## 새로운 기능 추가 시 체크리스트

- [ ] ROADMAP.md에서 작업 항목 마크
- [ ] HTML 구조 작성 (시맨틱 마크업)
- [ ] Tailwind CSS로 스타일 적용
- [ ] 필요시 JavaScript 로직 추가
- [ ] 모바일/태블릿/데스크톱에서 테스트
- [ ] 다크모드에서도 확인
- [ ] 접근성 검토 (스크린 리더, 키보드 네비게이션)
- [ ] 커밋 및 문서 업데이트
