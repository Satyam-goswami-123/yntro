import { test, expect } from '@playwright/test';

test.describe('Onboarding and Auth Flow', () => {
  test('redirects to login when unauthenticated', async ({ page }) => {
    // Clear localStorage to simulate fresh user
    await page.goto('/');
    
    // Evaluate to clear storage, then reload
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('can signup and complete onboarding', async ({ page }) => {
    await page.goto('/login');
    
    // Switch to Signup
    await page.getByText('Sign up').click();
    
    // Fill credentials
    await page.getByPlaceholder('eco@explorer.com').fill('test@playwright.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Wait for redirect to home
    await expect(page).toHaveURL('/');

    // Check if the game overlay appears
    await expect(page.getByText('yntro.')).toBeVisible();
    await expect(page.getByText('Take Control')).toBeVisible();
  });
});
