/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 프라이머리, 세컨더리, 악센트 색상은 Phase 5에서 확정 예정
      },
      spacing: {
        // 간격 및 패딩 커스터마이징은 Phase 5에서 확정 예정
      },
    },
  },
  plugins: [],
}
