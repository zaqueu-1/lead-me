import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test('should load the application correctly', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle(/lead\.me/);

        await expect(page.locator('[placeholder="Search by name or company..."]')).toBeVisible();
        await expect(page.getByText('Export CSV')).toBeVisible();
        await expect(page.getByText('Import CSV')).toBeVisible();
    });

    test('should toggle between leads and opportunities tabs', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('[data-testid="leads-tab"]')).toHaveClass(/bg-brand-primary/);

        await page.locator('[data-testid="opportunities-tab"]').click();
        await expect(page.locator('[data-testid="opportunities-tab"]')).toHaveClass(/bg-brand-primary/);
        await expect(page.getByRole('heading', { name: 'Opportunities', exact: true })).toBeVisible();

        await page.locator('[data-testid="leads-tab"]').click();
        await expect(page.locator('[data-testid="leads-tab"]')).toHaveClass(/bg-brand-primary/);
    });

    test('should toggle view modes between cards and table', async ({ page }) => {
        await page.goto('/');

        await page.waitForSelector('[data-testid="lead-card"], [data-testid="leads-table"]', { timeout: 10000 });

        await expect(page.locator('[data-testid="lead-card"]').first()).toBeVisible();

        const viewToggle = page.locator('button[title*="view"]').first();
        await viewToggle.click();

        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('th').first()).toBeVisible();

        await viewToggle.click();
        await expect(page.locator('[data-testid="lead-card"]').first()).toBeVisible();
    });
});
