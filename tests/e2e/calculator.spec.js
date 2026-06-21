import { test, expect } from '@playwright/test';

test.describe('Calculator Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('yntro_user', JSON.stringify({ email: 'test@example.com' }));
    });
    await page.goto('/calculator');
  });

  test('can complete a carbon calculation', async ({ page }) => {
    // Step 1: Transport
    await expect(page.getByText('Transportation')).toBeVisible();
    await page.getByLabel('Car (Petrol) in km').fill('15');
    await page.getByRole('button', { name: 'Next →' }).click();

    // Step 2: Electricity
    await expect(page.getByText('Electricity', { exact: true })).toBeVisible();
    await page.getByLabel('Grid Electricity in kWh').fill('10');
    await page.getByRole('button', { name: 'Next →' }).click();

    // Step 3: Water
    await expect(page.getByText('Water Usage')).toBeVisible();
    await page.getByRole('button', { name: 'Next →' }).click();

    // Step 4: Food
    await expect(page.getByText('Food & Diet')).toBeVisible();
    await page.getByLabel('Vegetarian Meal in meal').fill('2');
    await page.getByRole('button', { name: 'Next →' }).click();

    // Step 5: Shopping
    await expect(page.getByText('Shopping', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Next →' }).click();

    // Step 6: Waste
    await expect(page.getByText('Waste', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Calculate →' }).click();

    // Results Page
    await expect(page.getByText('Your Carbon Footprint')).toBeVisible();
    
    // Check if total is calculated (15*0.21 = 3.15) + (10*0.82 = 8.2) + (2*1.7 = 3.4) = 14.75
    // Wait for the animation to finish or just check the text exists
    await expect(page.getByText('14.75')).toBeVisible();
  });
});
