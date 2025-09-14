import { test, expect } from '@playwright/test';

test.describe('Basic E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('[data-testid="lead-card"], [data-testid="leads-table"]', { timeout: 10000 });
    });

    test('should load the application and display leads', async ({ page }) => {
        await expect(page).toHaveTitle(/lead\.me/);

        await expect(page.locator('[placeholder="Search by name or company..."]')).toBeVisible();
        await expect(page.getByText('Export CSV')).toBeVisible();
        await expect(page.getByText('Import CSV')).toBeVisible();

        await expect(page.locator('[data-testid="lead-card"]').first()).toBeVisible();

        await expect(page.locator('text=/\\d+ leads? total/')).toBeVisible();
    });

    test('should switch between tabs', async ({ page }) => {
        await expect(page.locator('[data-testid="leads-tab"]')).toHaveClass(/bg-brand-primary/);

        await page.locator('[data-testid="opportunities-tab"]').click();
        await expect(page.locator('[data-testid="opportunities-tab"]')).toHaveClass(/bg-brand-primary/);
        await expect(page.getByRole('heading', { name: 'Opportunities', exact: true })).toBeVisible();

        await page.locator('[data-testid="leads-tab"]').click();
        await expect(page.locator('[data-testid="leads-tab"]')).toHaveClass(/bg-brand-primary/);
    });

    test('should toggle view modes', async ({ page }) => {
        await expect(page.locator('[data-testid="lead-card"]').first()).toBeVisible();

        const viewToggle = page.locator('button[title*="Switch to table"], button[title*="Switch to cards"]');
        await viewToggle.click();

        await expect(page.locator('[data-testid="leads-table"]')).toBeVisible();
        await expect(page.locator('th').first()).toBeVisible();

        await viewToggle.click();
        await expect(page.locator('[data-testid="lead-card"]').first()).toBeVisible();
    });

    test('should open and close lead detail panel', async ({ page }) => {
        await page.locator('[data-testid="lead-card"]').first().click();

        await expect(page.locator('[data-testid="lead-detail-panel"]')).toBeVisible();

        await page.locator('button[title="Close panel"]').click();
        await expect(page.locator('[data-testid="lead-detail-panel"]')).not.toBeVisible();
    });

    test('should filter leads by search', async ({ page }) => {
        const searchInput = page.locator('[placeholder="Search by name or company..."]');

        const initialCount = await page.locator('[data-testid="lead-card"]').count();
        expect(initialCount).toBeGreaterThan(0);

        await searchInput.fill('Tech');

        await page.waitForTimeout(500);

        const filteredCount = await page.locator('[data-testid="lead-card"]').count();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);

        await searchInput.clear();
        await page.waitForTimeout(500);

        const finalCount = await page.locator('[data-testid="lead-card"]').count();
        expect(finalCount).toBe(initialCount);
    });

    test('should open filter panel', async ({ page }) => {
        await page.locator('button[title="Toggle Filters"]').click();

        await expect(page.locator('select:has-text("Filter by: Status")')).toBeVisible();
        await expect(page.locator('select:has-text("Filter by: Source")')).toBeVisible();

        await page.locator('button[title="Toggle Filters"]').click();
        await expect(page.locator('select:has-text("Filter by: Status")')).not.toBeVisible();
    });

    test('should toggle dark mode', async ({ page }) => {
        const darkModeToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
        await darkModeToggle.click();

        await page.waitForTimeout(200);

        const isDarkMode = await page.locator('html').evaluate(el => el.classList.contains('dark'));
        expect(isDarkMode).toBeTruthy();
    });

    test('should persist data after reload', async ({ page }) => {
        const initialCount = await page.locator('[data-testid="lead-card"]').count();

        await page.reload();
        await page.waitForSelector('[data-testid="lead-card"]', { timeout: 10000 });

        const reloadedCount = await page.locator('[data-testid="lead-card"]').count();
        expect(reloadedCount).toBe(initialCount);
    });
});
