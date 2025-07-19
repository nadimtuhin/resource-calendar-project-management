import { test, expect } from '@playwright/test';

test.describe('Resource Calendar App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Resource Calendar');
  });

  test('should show empty state initially', async ({ page }) => {
    await expect(page.locator('h2:has-text("Welcome to Resource Calendar")')).toBeVisible();
  });

  test('should load test data when clicked', async ({ page }) => {
    await page.click('button:has-text("Load Sample Data")');
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should open management panel', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    // Wait for modal to appear - look for modal content
    await expect(page.locator('text=Resources')).toBeVisible();
  });
});