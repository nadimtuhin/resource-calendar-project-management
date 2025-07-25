import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImage(inputPath, outputPath) {
  await sharp(inputPath)
    .jpeg({
      quality: 85,
      progressive: true
    })
    .toFile(outputPath);
  
  // Remove original PNG
  fs.unlinkSync(inputPath);
}

async function takeSimpleScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const baseUrl = 'https://resource-calendar-project-management.vercel.app';
  await page.goto(baseUrl);

  const screenshotsDir = path.join(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Taking simple screenshots...');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // First, take empty state screenshot if present
  console.log('Checking for empty state...');
  const loadSampleButton = page.locator('button:has-text("Load Sample Data")');
  if (await loadSampleButton.count() > 0) {
    console.log('0. Taking empty state screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'empty-state-new.png'),
      fullPage: false
    });
    await optimizeImage(
      path.join(screenshotsDir, 'empty-state-new.png'),
      path.join(screenshotsDir, 'empty-state-new.jpg')
    );
  }

  // Load test data if empty state is present
  console.log('Loading test data...');
  try {
    if (await loadSampleButton.count() > 0) {
      await loadSampleButton.click();
      await page.waitForTimeout(3000);
      console.log('Test data loaded from empty state');
    } else {
      // Try header load test data button
      const loadTestDataButton = page.locator('button:has-text("Load Test Data")');
      if (await loadTestDataButton.count() > 0) {
        await loadTestDataButton.click();
        await page.waitForTimeout(3000);
        console.log('Test data loaded from header');
      } else {
        console.log('No load data buttons found - app may already have data');
      }
    }
  } catch (error) {
    console.log('Could not load test data, proceeding with existing data:', error.message);
  }

  // 1. Full page screenshot
  console.log('1. Taking full page screenshot...');
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'full-page.png'),
    fullPage: true
  });
  await optimizeImage(
    path.join(screenshotsDir, 'full-page.png'),
    path.join(screenshotsDir, 'full-page.jpg')
  );

  // 2. Header section
  console.log('2. Taking header screenshot...');
  const header = await page.locator('header, .header, [class*="header"]').first();
  if (await header.count() > 0) {
    await header.screenshot({ 
      path: path.join(screenshotsDir, 'header.png')
    });
    await optimizeImage(
      path.join(screenshotsDir, 'header.png'),
      path.join(screenshotsDir, 'header.jpg')
    );
  }

  // 3. Main content area
  console.log('3. Taking main content screenshot...');
  const main = await page.locator('main, .main-content, [role="main"]').first();
  if (await main.count() > 0) {
    await main.screenshot({ 
      path: path.join(screenshotsDir, 'main-content.png')
    });
    await optimizeImage(
      path.join(screenshotsDir, 'main-content.png'),
      path.join(screenshotsDir, 'main-content.jpg')
    );
  }

  // 4. Mobile view
  console.log('4. Taking mobile view screenshot...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'mobile-view.png'),
    fullPage: false
  });
  await optimizeImage(
    path.join(screenshotsDir, 'mobile-view.png'),
    path.join(screenshotsDir, 'mobile-view.jpg')
  );

  // 5. Tablet view
  console.log('5. Taking tablet view screenshot...');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'tablet-view.png'),
    fullPage: false
  });
  await optimizeImage(
    path.join(screenshotsDir, 'tablet-view.png'),
    path.join(screenshotsDir, 'tablet-view.jpg')
  );

  await browser.close();
  console.log('Simple screenshots taken and optimized successfully!');
}

takeSimpleScreenshots().catch(console.error);