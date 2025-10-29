import { test, expect } from '@playwright/test';

test('site navigation flows', async ({ page }) => {
  // Visit the site and click through main navigation links.
  await page.goto('https://mineral-map-base.netlify.app/');
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Minerals' }).click();
  await page.getByRole('link', { name: 'Guided Tour' }).click();
  await page.getByRole('link', { name: 'About' }).click();
  await page.getByRole('link', { name: 'Help' }).click();
  await page.getByRole('link', { name: 'Mineral Map' }).click();
});
