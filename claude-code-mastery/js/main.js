// 모바일 네비게이션 토글
document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
      // aria-expanded 접근성 속성 갱신
      const isExpanded = !mobileMenu.classList.contains('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });

    // 모바일 메뉴에서 링크 클릭 시 메뉴 닫기
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        // 메뉴 닫을 때도 aria-expanded 갱신
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
