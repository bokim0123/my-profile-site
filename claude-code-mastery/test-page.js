const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  try {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'screenshot-desktop.png' });
    console.log('Desktop screenshot saved: screenshot-desktop.png');
    
    // 모바일 뷰
    await page.setViewport({ width: 375, height: 812 });
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'screenshot-mobile.png' });
    console.log('Mobile screenshot saved: screenshot-mobile.png');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
