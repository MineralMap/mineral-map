import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://mineral-map-base.netlify.app/');
  await page.getByRole('link', { name: 'Minerals', exact: true }).click();
  await page.getByRole('link', { name: 'Learn More ' }).nth(1).click();
});