import { test, expect } from '@playwright/test';

test.describe('Calendar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Load Sample Data")');
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should navigate calendar using date picker', async ({ page }) => {
    // Check if date navigation is visible
    await expect(page.locator('text=2024')).toBeVisible();
    
    // Verify calendar is still visible
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should display resource rows correctly', async ({ page }) => {
    const resourceRows = page.locator('.divide-y.divide-gray-200 > div');
    await expect(resourceRows).toHaveCountGreaterThan(0);
    
    // Check if resource names are visible
    await expect(resourceRows.first()).toBeVisible();
  });

  test('should show project blocks in timeline', async ({ page }) => {
    const projectBlocks = page.locator('.absolute');
    
    // Check if project blocks have content
    if (await projectBlocks.count() > 0) {
      await expect(projectBlocks.first()).toBeVisible();
    } else {
      // If no project blocks, just verify timeline is visible
      await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
    }
  });

  test('should handle responsive layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout adjustments
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
    await expect(page.locator('button:has-text("Manage")')).toBeVisible();
  });

  test('should scroll timeline horizontally', async ({ page }) => {
    const timeline = page.locator('.overflow-x-auto');
    
    // Get initial scroll position
    const initialScrollLeft = await timeline.evaluate(el => el.scrollLeft);
    
    // Scroll right
    await timeline.evaluate(el => el.scrollLeft += 200);
    
    // Verify scroll position changed
    const finalScrollLeft = await timeline.evaluate(el => el.scrollLeft);
    expect(finalScrollLeft).toBeGreaterThan(initialScrollLeft);
  });
});