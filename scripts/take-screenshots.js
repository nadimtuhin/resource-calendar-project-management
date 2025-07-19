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

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Navigate to the application
  const baseUrl = 'https://resource-calendar-project-management-qz3pm227m.vercel.app';
  await page.goto(baseUrl);

  const screenshotsDir = path.join(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Taking screenshots...');

  // 1. Empty State Screenshot
  console.log('1. Taking empty state screenshot...');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'empty-state.png'),
    fullPage: false
  });
  await optimizeImage(
    path.join(screenshotsDir, 'empty-state.png'),
    path.join(screenshotsDir, 'empty-state.jpg')
  );

  // 2. Load Test Data
  console.log('2. Loading test data...');
  try {
    // Try to find the Load Sample Data button
    const loadButton = await page.locator('button:has-text("Load Sample Data")').first();
    await loadButton.click({ timeout: 5000 });
    await page.waitForTimeout(2000);
  } catch (error) {
    console.log('Could not find Load Sample Data button, trying alternative approach...');
    // If no empty state, try to use the header load test data button
    try {
      await page.click('button:has-text("Load Test Data")');
      await page.waitForTimeout(2000);
    } catch (error2) {
      console.log('No test data button found, continuing with existing data...');
    }
  }

  // 3. Main Dashboard with Data
  console.log('3. Taking main dashboard screenshot...');
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'main-dashboard.png'),
    fullPage: false
  });
  await optimizeImage(
    path.join(screenshotsDir, 'main-dashboard.png'),
    path.join(screenshotsDir, 'main-dashboard.jpg')
  );

  // 4. Management Center Modal
  console.log('4. Taking management center screenshot...');
  await page.click('button:has-text("Management Center")');
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'management-center.png'),
    fullPage: false
  });
  await optimizeImage(
    path.join(screenshotsDir, 'management-center.png'),
    path.join(screenshotsDir, 'management-center.jpg')
  );

  // 5. Project Analytics Tab
  console.log('5. Taking project analytics screenshot...');
  await page.click('button:has-text("Projects")');
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'project-analytics.png'),
    fullPage: false
  });
  await optimizeImage(
    path.join(screenshotsDir, 'project-analytics.png'),
    path.join(screenshotsDir, 'project-analytics.jpg')
  );

  // Close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 6. Full Timeline View
  console.log('6. Taking full timeline screenshot...');
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'timeline-view.png'),
    fullPage: true
  });
  await optimizeImage(
    path.join(screenshotsDir, 'timeline-view.png'),
    path.join(screenshotsDir, 'timeline-view.jpg')
  );

  // 7. Resource Addition Modal
  console.log('7. Taking resource modal screenshot...');
  await page.click('button:has-text("Add Resource")');
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'resource-modal.png'),
    fullPage: false
  });
  await optimizeImage(
    path.join(screenshotsDir, 'resource-modal.png'),
    path.join(screenshotsDir, 'resource-modal.jpg')
  );

  // Close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 8. Project Creation Modal
  console.log('8. Taking project modal screenshot...');
  await page.click('button:has-text("Add Project")');
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'project-modal.png'),
    fullPage: false
  });
  await optimizeImage(
    path.join(screenshotsDir, 'project-modal.png'),
    path.join(screenshotsDir, 'project-modal.jpg')
  );

  // Close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 9. Mobile View
  console.log('9. Taking mobile view screenshot...');
  await page.setViewportSize({ width: 375, height: 812 }); // iPhone X size
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: path.join(screenshotsDir, 'mobile-view.png'),
    fullPage: false
  });
  await optimizeImage(
    path.join(screenshotsDir, 'mobile-view.png'),
    path.join(screenshotsDir, 'mobile-view.jpg')
  );

  await browser.close();
  console.log('Screenshots taken and optimized successfully!');
}

takeScreenshots().catch(console.error);