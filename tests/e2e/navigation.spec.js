import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock a logged-in user in localStorage
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('yntro_user', JSON.stringify({ email: 'test@example.com' }));
    });
    await page.goto('/');
  });

  test('can navigate to all main pages', async ({ page }) => {
    // Dashboard (Explore)
    await page.getByRole('link', { name: 'Explore' }).click();
    await expect(page).toHaveURL(/.*explore/);
    await expect(page.getByText('Emission Breakdown')).toBeVisible();

    // Calculator
    await page.getByRole('link', { name: 'Calculator' }).click();
    await expect(page).toHaveURL(/.*calculator/);
    await expect(page.getByText('Carbon Calculator')).toBeVisible();

    // Coach
    await page.getByRole('link', { name: 'AI Coach' }).click();
    await expect(page).toHaveURL(/.*coach/);
    await expect(page.getByText('AI Sustainability Coach')).toBeVisible();

    // Missions
    await page.getByRole('link', { name: 'Missions' }).click();
    await expect(page).toHaveURL(/.*missions/);
    await expect(page.getByText('Sustainability Missions')).toBeVisible();
  });
});
