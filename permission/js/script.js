// DOM 요소 선택
const darkModeBtn = document.getElementById('dark-mode-btn');
const htmlElement = document.documentElement;
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const emailCopyBtn = document.getElementById('email-copy-btn');

// 다크모드 토글
function toggleDarkMode() {
  const isDark = htmlElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

darkModeBtn.addEventListener('click', toggleDarkMode);

// 모바일 메뉴 토글
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  const isExpanded = !mobileMenu.classList.contains('hidden');
  mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
});

// 모바일 메뉴에서 링크 클릭 시 메뉴 닫기
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  });
});

// IntersectionObserver로 스크롤 시 섹션 페이드인
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// 모든 fade-in 요소 관찰
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// 활성 섹션 하이라이트
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 모든 링크에서 active 클래스 제거
      navLinks.forEach(link => link.classList.remove('active'));

      // 현재 섹션에 해당하는 링크에 active 클래스 추가
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, { threshold: 0.3 });

// 모든 섹션 관찰
document.querySelectorAll('section').forEach(section => {
  sectionObserver.observe(section);
});

// 스무스 스크롤 (HTML에 scroll-smooth 클래스로 구현)

// 이메일 클립보드 복사
emailCopyBtn.addEventListener('click', async () => {
  const email = emailCopyBtn.getAttribute('data-email');
  try {
    await navigator.clipboard.writeText(email);
    const originalAriaLabel = emailCopyBtn.getAttribute('aria-label');
    emailCopyBtn.setAttribute('aria-label', '복사됨!');
    setTimeout(() => {
      emailCopyBtn.setAttribute('aria-label', originalAriaLabel);
    }, 2000);
  } catch (err) {
    console.error('클립보드 복사 실패:', err);
  }
});

// 연락처 폼 제출
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // 폼 유효성 검사 (HTML required 속성으로 이미 기본 검사됨)
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showFormMessage('모든 항목을 입력해주세요.', 'error');
    return;
  }

  // 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormMessage('올바른 이메일 형식을 입력해주세요.', 'error');
    return;
  }

  // 성공 메시지 (실제 제출 로직은 없고 UI 피드백만 제공)
  showFormMessage('메시지가 전송되었습니다! 감사합니다.', 'success');

  // 폼 초기화
  contactForm.reset();

  // 3초 후 메시지 숨김
  setTimeout(() => {
    formMessage.classList.add('hidden');
  }, 3000);
});

// 폼 메시지 표시 함수
function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.classList.remove('hidden');
  formMessage.className = `text-sm text-center ${type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`;
}
