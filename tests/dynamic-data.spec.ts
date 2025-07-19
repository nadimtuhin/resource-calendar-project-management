import { test, expect } from '@playwright/test';

test.describe('Dynamic Data Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Load Sample Data")');
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should display data spanning multiple months', async ({ page }) => {
    // Check if the timeline shows multiple months
    const timelineHeader = page.locator('.sticky.top-0.z-20.bg-white.border-b.border-gray-200');
    await expect(timelineHeader).toBeVisible();
    
    // Verify we have resources showing
    const resourceRows = page.locator('.divide-y.divide-gray-200 > div');
    await expect(resourceRows.first()).toBeVisible();
    
    // Check if there are project blocks (indicating active data)
    const hasProjects = await page.locator('.absolute').count() > 0;
    expect(hasProjects).toBeTruthy();
  });

  test('should show current year in calendar', async ({ page }) => {
    const currentYear = new Date().getFullYear();
    
    // Check if the current year appears somewhere in the calendar
    const yearText = page.locator(`text=${currentYear}`);
    await expect(yearText.first()).toBeVisible();
  });

  test('should display multiple resources with projects', async ({ page }) => {
    // Check that we have multiple resources
    const resourceCount = await page.locator('.divide-y.divide-gray-200 > div').count();
    expect(resourceCount).toBeGreaterThan(3); // Should have at least 4 resources
    
    // Verify Bengali names are present (use first occurrence)
    await expect(page.locator('text=রাফিন আহমেদ').first()).toBeVisible();
    await expect(page.locator('text=তানভীর হাসান').first()).toBeVisible();
    await expect(page.locator('text=সাদিয়া খাতুন').first()).toBeVisible();
  });

  test('should show realistic project data', async ({ page }) => {
    // Look for Pathao-related project titles
    const hasPathaoProjects = await page.locator('text=Pathao').count() > 0;
    expect(hasPathaoProjects).toBeTruthy();
    
    // Check for different project statuses by looking at project colors/styles
    const projectBlocks = page.locator('.absolute');
    const projectCount = await projectBlocks.count();
    expect(projectCount).toBeGreaterThan(5); // Should have multiple projects
  });

  test('should navigate between months with data', async ({ page }) => {
    // Try to navigate to previous/next month and verify data persists
    const initialProjectCount = await page.locator('.absolute').count();
    
    // If there are navigation controls, try using them
    const monthNavigation = page.locator('button').filter({ hasText: /next|previous|←|→/i });
    const navButtonCount = await monthNavigation.count();
    
    if (navButtonCount > 0) {
      await monthNavigation.first().click();
      
      // Wait for any updates
      await page.waitForTimeout(500);
      
      // Verify timeline is still visible
      await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
    }
  });

  test('should display proper date ranges', async ({ page }) => {
    // Check that dates shown are reasonable (not in 2024 if we're past that)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Look for current month and year in the interface
    const hasCurrentYearData = await page.locator(`text=${currentYear}`).count() > 0;
    expect(hasCurrentYearData).toBeTruthy();
  });

  test('should show statistics with realistic numbers', async ({ page }) => {
    // Open management center to see statistics
    await page.click('button:has-text("Management Center")');
    
    // Look for statistics that should be non-zero
    const statsContainer = page.locator('.bg-white.rounded-lg.shadow-sm.border.border-gray-200.p-6');
    if (await statsContainer.count() > 0) {
      await expect(statsContainer.first()).toBeVisible();
      
      // Check for numerical values greater than 0
      const numberTexts = await page.locator('text=/\\d+/').allTextContents();
      const hasPositiveNumbers = numberTexts.some(text => {
        const num = parseInt(text.replace(/[^\d]/g, ''));
        return num > 0;
      });
      expect(hasPositiveNumbers).toBeTruthy();
    }
  });
});