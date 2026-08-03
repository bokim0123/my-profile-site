# 개발자 포트폴리오 및 웹 이력서

반응형 1페이지 개발자 포트폴리오 웹사이트입니다. HTML5, CSS3, Tailwind CSS, Vanilla JavaScript를 활용하여 만들어졌습니다.

## 🎯 주요 기능

- ✨ **다크모드 지원** — 라이트/다크 테마 자동 전환 및 사용자 선택 저장
- 📱 **반응형 디자인** — 모바일부터 데스크톱까지 모든 기기에 최적화
- 🎨 **현대적 UI** — Tailwind CSS 기반 세련된 디자인
- ⌨️ **접근성** — 키보드 내비게이션 및 WCAG 기준 준수
- 🚀 **성능 최적화** — 외부 의존성 최소화, 인라인 SVG 활용
- 📊 **섹션 구성**
  - Hero: 자기소개 및 SNS 링크
  - About: 경력 설명
  - Experience: 경력사항
  - Skills: 기술 스택
  - Projects: 포트폴리오 프로젝트
  - Education: 학력 및 자격증
  - Contact: 연락처 및 문의 폼

## 🛠️ 기술 스택

- **HTML5** — 시맨틱 마크업
- **CSS3 & Tailwind CSS** — 유틸리티 기반 스타일링
- **JavaScript (Vanilla)** — 인터랙션 (다크모드, 메뉴, 스크롤)
- **Node.js & npm** — Tailwind CLI 빌드

## 📁 프로젝트 구조

```
permission/
├── index.html              # 메인 HTML 파일
├── css/
│   ├── input.css           # Tailwind 소스
│   └── styles.css          # 빌드 결과물 (git commit 포함)
├── js/
│   └── script.js           # JavaScript 인터랙션
├── package.json            # npm 설정
├── tailwind.config.js      # Tailwind 설정
├── postcss.config.js       # PostCSS 설정
├── .gitignore              # Git 무시 파일
├── README.md               # 이 파일
└── CLAUDE.md               # 개발 가이드
```

## 🚀 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. CSS 빌드

#### 개발 모드 (파일 감시)
```bash
npm run watch:css
```

#### 프로덕션 빌드 (최소화)
```bash
npm run build:css
```

### 3. 로컬 서버 실행

#### Python 내장 서버 (권장)
```bash
python -m http.server 8000
```

#### Node.js Live Server
```bash
npx live-server
```

그 후 브라우저에서 `http://localhost:8000` 접속.

## 🎨 다크모드 사용

- 헤더의 해/달 아이콘 버튼을 클릭하여 다크모드 토글
- 사용자 선택은 브라우저 `localStorage`에 저장되어 다음 방문 시 유지됨
- 기본 테마는 OS의 `prefers-color-scheme` 설정을 따름

## 📱 반응형 디자인

- **모바일 (`sm` 미만)**: 햄버거 메뉴, 스택 레이아웃
- **태블릿 (`md`)**: 데스크톱 메뉴, 2열 그리드
- **데스크톱 (`lg`)**: 넓은 컨테이너, 최적화된 여백

## ⌨️ 접근성 기능

- 스킵 링크: 키보드로 본문으로 바로 이동 가능
- ARIA 라벨: 모든 버튼과 상호작용 요소에 `aria-label` 포함
- 시맨틱 HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` 등 의미론적 태그 사용
- 포커스 스타일: 모든 포커스 가능한 요소에 `focus:ring` 시각적 표시
- 키보드 내비게이션: 탭 키로 모든 기능 접근 가능

## 📋 콘텐츠 커스터마이징

`index.html`의 다음 항목들을 자신의 정보로 수정하세요:

- **Hero 섹션**: 이름, 직함, 소개 텍스트, 프로필 이미지
- **About**: 자기소개 내용
- **Experience**: 경력사항 (회사, 기간, 직급, 업무)
- **Skills**: 기술 스택
- **Projects**: 포트폴리오 프로젝트 (링크 포함)
- **Education**: 학력, 자격증
- **Contact**: 이메일, SNS 링크

## 🔍 성능 & 접근성 점검 (Phase 6)

### Chrome DevTools Lighthouse 검사

1. Chrome 브라우저에서 페이지 열기
2. F12 또는 우클릭 → "검사" → "Lighthouse" 탭
3. "분석" 버튼 클릭
4. 다음 항목 확인:
   - **Performance**: 90점 이상 권장
   - **Accessibility**: 95점 이상 권장
   - **Best Practices**: 95점 이상 권장
   - **SEO**: 95점 이상 권장

### 주요 확인 사항

- ✅ 시맨틱 HTML 사용 (헤더 계층 h1→h2→h3 준수)
- ✅ 모든 이미지/아이콘에 `alt` 또는 `aria-label` 속성
- ✅ 폼 요소의 `<label>` 연결
- ✅ 색상 대비도 충분 (WCAG AA 기준 4.5:1 이상)
- ✅ 모바일 뷰포트에서 터치 대상 크기 48px 이상
- ✅ 키보드만으로 모든 기능 접근 가능

### 모바일 테스트

- Chrome DevTools에서 "Device Toolbar" 활성화
- iPhone SE, Pixel 4 등 다양한 기기 해상도에서 테스트
- 터치 제스처 및 버튼 클릭 동작 확인

## 📦 빌드 & 배포

### CSS 프로덕션 빌드

```bash
npm run build:css
```

### 정적 호스팅 배포 (선택사항)

아래 플랫폼 중 하나를 선택하여 배포할 수 있습니다:

- **GitHub Pages**: 무료, GitHub 저장소 활용
- **Vercel**: 무료, 자동 배포
- **Netlify**: 무료, 사용자 친화적

## 🔗 참고 자료

- [Tailwind CSS 공식 문서](https://tailwindcss.com)
- [MDN - 웹 접근성](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)

## 📝 라이선스

MIT License

## 👨‍💼 개발자

박개발자 ([GitHub](https://github.com), [LinkedIn](https://linkedin.com))

---

**마지막 업데이트**: 2026년 8월 3일
