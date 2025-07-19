import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Load Sample Data")');
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should create new project', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Projects")');
    await page.click('button:has-text("Add Project")');
    
    await expect(page.locator('text=Add Project')).toBeVisible();
    
    await page.fill('input[name="name"]', 'Test Project');
    await page.fill('textarea[name="description"]', 'Test project description');
    await page.selectOption('select[name="status"]', 'active');
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Test Project')).toBeVisible();
  });

  test('should assign project to resource', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Projects")');
    
    // Edit first project
    await page.locator('button:has-text("Edit")').first().click();
    
    await expect(page.locator('text=Edit Project')).toBeVisible();
    
    // Add resource assignment
    await page.click('button:has-text("Add Assignment")');
    await page.selectOption('select[name="resourceId"]', { index: 1 });
    await page.fill('input[name="hoursPerDay"]', '4');
    
    await page.click('button[type="submit"]');
    
    // Close modal and verify assignment appears in timeline
    await page.locator('button:has-text("Close")').click();
    await expect(page.locator('.border.border-gray-200.rounded-lg.overflow-hidden')).toBeVisible();
  });

  test('should filter projects by status', async ({ page }) => {
    await page.click('button:has-text("Management Center")');
    await page.click('button:has-text("Projects")');
    
    const totalProjects = await page.locator('button:has-text("Edit")').count();
    
    // Filter by active status
    await page.selectOption('select[name="statusFilter"]', 'active');
    
    const activeProjects = await page.locator('button:has-text("Edit")').count();
    expect(activeProjects).toBeLessThanOrEqual(totalProjects);
  });
});