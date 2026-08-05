// ============================================
// Dark Mode Toggle
// ============================================
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Initialize theme from localStorage or system preference
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

themeToggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ============================================
// Mobile Menu Toggle
// ============================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = mobileMenu.querySelectorAll('.nav-link');

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// Scroll-based Fade-in Animation
// ============================================
const fadeInElements = document.querySelectorAll('[class*="opacity-0"]');

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-6');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeInElements.forEach(el => {
    fadeInObserver.observe(el);
  });
} else {
  // If prefers-reduced-motion, show immediately
  fadeInElements.forEach(el => {
    el.classList.remove('opacity-0', 'translate-y-6');
  });
}

// ============================================
// Active Nav Link Highlighting
// ============================================
const sections = document.querySelectorAll('section[id]');
const desktopNavLinks = document.querySelectorAll('nav:not(#mobile-menu) .nav-link');
const allNavLinks = document.querySelectorAll('.nav-link');

const navObserverOptions = {
  threshold: 0.3,
  rootMargin: '-20% 0px -66% 0px'
};

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      allNavLinks.forEach(link => {
        link.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-semibold');
        link.classList.add('text-slate-600', 'dark:text-slate-400');
      });

      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) {
        activeLink.classList.add('text-blue-600', 'dark:text-blue-400', 'font-semibold');
        activeLink.classList.remove('text-slate-600', 'dark:text-slate-400');
      }
    }
  });
}, navObserverOptions);

sections.forEach(section => {
  navObserver.observe(section);
});

// ============================================
// Email Copy to Clipboard
// ============================================
const emailCopyBtn = document.getElementById('email-copy-btn');

emailCopyBtn.addEventListener('click', async () => {
  const email = emailCopyBtn.getAttribute('data-email');
  try {
    await navigator.clipboard.writeText(email);
    const originalLabel = emailCopyBtn.getAttribute('aria-label');
    emailCopyBtn.setAttribute('aria-label', '복사됨!');
    setTimeout(() => {
      emailCopyBtn.setAttribute('aria-label', originalLabel);
    }, 2000);
  } catch (err) {
    console.error('Failed to copy email:', err);
  }
});

// ============================================
// Footer Year Auto-Update
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// Initialize Theme on Page Load
// ============================================
initializeTheme();
