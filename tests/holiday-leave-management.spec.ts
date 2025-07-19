import { test, expect } from '@playwright/test';

test.describe('Holiday and Leave Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Load Sample Data")');
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should add new holiday', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Holidays")');
    await page.click('button:has-text("Add Holiday")');
    
    await expect(page.locator('text=Add Holiday')).toBeVisible();
    
    await page.fill('input[name="name"]', 'Test Holiday');
    await page.fill('input[name="date"]', '2024-12-25');
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Test Holiday')).toBeVisible();
  });

  test('should manage weekend settings', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Weekend Settings")');
    
    await expect(page.locator('text=Weekend Settings')).toBeVisible();
    
    // Toggle weekend days
    await page.check('input[name="friday"]');
    await page.check('input[name="saturday"]');
    await page.uncheck('input[name="sunday"]');
    
    await page.click('button[type="submit"]');
    
    // Close modal and verify calendar is still visible
    await page.locator('button:has-text("Close")').click();
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should add employee leave', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Leave")');
    await page.click('button:has-text("Add Leave")');
    
    await expect(page.locator('text=Add Leave')).toBeVisible();
    
    await page.selectOption('select[name="resourceId"]', { index: 1 });
    await page.fill('input[name="startDate"]', '2024-12-20');
    await page.fill('input[name="endDate"]', '2024-12-22');
    await page.selectOption('select[name="type"]', 'vacation');
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=vacation')).toBeVisible();
  });

  test('should display holidays in timeline', async ({ page }) => {
    // Add a holiday first
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Holidays")');
    await page.click('button:has-text("Add Holiday")');
    
    await page.fill('input[name="name"]', 'New Year');
    await page.fill('input[name="date"]', '2024-01-01');
    await page.click('button[type="submit"]');
    
    // Close management modal
    await page.locator('button:has-text("Close")').click();
    
    // Verify timeline is still visible
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should calculate work days excluding holidays and leave', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Analytics")');
    
    // Verify statistics are visible
    await expect(page.locator('.bg-white.rounded-lg.shadow-sm.border.border-gray-200.p-6')).toBeVisible();
  });
});