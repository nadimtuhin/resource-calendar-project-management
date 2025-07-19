import { test, expect } from '@playwright/test';

test.describe('State Sharing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Load Sample Data")');
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should generate shareable URL', async ({ page }) => {
    await page.click('button:has-text("Share")');
    
    await expect(page.locator('text=Share Calendar')).toBeVisible();
    
    // Click generate URL button
    await page.click('button:has-text("Generate Share URL")');
    
    // Verify URL is generated
    const urlInput = page.locator('input[name="shareUrl"]');
    await expect(urlInput).toHaveValue(/.*state=.*/);
  });

  test('should copy share URL to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.click('button:has-text("Share")');
    await page.click('button:has-text("Generate Share URL")');
    
    // Click copy button
    await page.click('button:has-text("Copy URL")');
    
    // Verify success message
    await expect(page.locator('text=URL copied to clipboard')).toBeVisible();
  });

  test('should export state as JSON', async ({ page }) => {
    await page.click('button:has-text("Share")');
    
    // Click export JSON button
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export JSON")');
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toMatch(/resource-calendar-state.*\.json/);
  });

  test('should import state from JSON', async ({ page }) => {
    await page.click('button:has-text("Import")');
    
    await expect(page.locator('text=Import State')).toBeVisible();
    
    // Create a test JSON state
    const testState = {
      resources: [{ id: 'test-1', name: 'Test User', role: 'Developer', department: 'Engineering' }],
      projects: [{ id: 'proj-1', name: 'Test Project', status: 'active' }],
      assignments: [],
      holidays: [],
      leave: []
    };
    
    // Fill in JSON textarea
    await page.fill('textarea[name="stateJson"]', JSON.stringify(testState));
    
    await page.click('button[type="submit"]');
    
    // Verify import success
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=Test Project')).toBeVisible();
  });

  test('should restore state from URL parameter', async ({ page }) => {
    // First, generate a share URL
    await page.click('button:has-text("Share")');
    await page.click('button:has-text("Generate Share URL")');
    
    const urlInput = page.locator('input[name="shareUrl"]');
    const shareUrl = await urlInput.inputValue();
    
    // Navigate to the share URL
    await page.goto(shareUrl);
    
    // Verify state is restored
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should handle invalid import data gracefully', async ({ page }) => {
    await page.click('button:has-text("Import")');
    
    // Try to import invalid JSON
    await page.fill('textarea[name="stateJson"]', 'invalid json');
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('text=Invalid JSON format')).toBeVisible();
  });
});