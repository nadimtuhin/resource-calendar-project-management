import { test, expect } from '@playwright/test';

test.describe('Resource Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Load test data first
    await page.click('button:has-text("Load Sample Data")');
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should open resource modal and create new resource', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Resources")');
    await page.click('button:has-text("Add Resource")');
    
    await expect(page.locator('text=Add Resource')).toBeVisible();
    
    await page.fill('input[name="name"]', 'Test Resource');
    await page.fill('input[name="role"]', 'Developer');
    await page.fill('input[name="department"]', 'Engineering');
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Test Resource')).toBeVisible();
  });

  test('should edit existing resource', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Resources")');
    
    // Click edit on first resource
    await page.locator('button:has-text("Edit")').first().click();
    
    await expect(page.locator('text=Edit Resource')).toBeVisible();
    
    await page.fill('input[name="role"]', 'Senior Developer');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Senior Developer')).toBeVisible();
  });

  test('should delete resource', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Resources")');
    
    const initialResourceCount = await page.locator('button:has-text("Delete")').count();
    
    // Click delete on first resource
    await page.locator('button:has-text("Delete")').first().click();
    
    // Confirm deletion
    await page.click('button:has-text("Confirm")');
    
    const finalResourceCount = await page.locator('button:has-text("Delete")').count();
    expect(finalResourceCount).toBe(initialResourceCount - 1);
  });
});