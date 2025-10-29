import { test, expect } from '@playwright/test';

test('test', async ({ page, context }) => {
  await page.goto('https://mineral-map-cms.netlify.app/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('dmmineralmap@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('supersecret123');
  // Submit the login form and wait for navigation. Don't press Enter and click the button
  // at the same time to avoid double submission / detached elements.
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.getByRole('button', { name: 'Sign In' }).click(),
  ]);
  // Ensure the post-login UI is visible before continuing.
  await expect(page.getByRole('button', { name: 'Add New Mineral Create a new' })).toBeVisible();
  await page.getByRole('button', { name: 'Add New Mineral Create a new' }).click();
  await page.getByRole('textbox', { name: 'Title', exact: true }).click();
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Test Mineral');
  // Wait for the TinyMCE iframe to be attached, then use a frameLocator that matches the iframe id suffix
  await page.waitForSelector('iframe[id$="_ifr"]', { timeout: 10000 });
  const iframeEl = await page.waitForSelector('iframe[id$="_ifr"]', { timeout: 10000 });
  const frame = await iframeEl.contentFrame();
  if (!frame) throw new Error('TinyMCE iframe not available');
  // Set the editor content directly inside the iframe. Using evaluate is more robust
  // than relying on a dynamic label or fragile codegen selectors.
  await frame.evaluate((text) => {
    // Replace editor body content. Adjust if the editor expects HTML.
    document.body.innerHTML = text;
  }, 'A mineral that is a test');
  await page.getByRole('combobox', { name: 'Status' }).click();
  await page.getByRole('option', { name: 'Published' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Select a category...' }).click();
  await page.getByRole('option', { name: 'Phosphates' }).click();
  await page.getByRole('button', { name: 'Save Mineral' }).click();
  // open the public site in a second page so we can keep the CMS session open
  const page1 = await context.newPage();
  await page1.goto('https://mineral-map-base.netlify.app/');
  await page1.getByRole('link', { name: 'View All Minerals ' }).click();
  await page1.getByRole('link', { name: 'Learn More ' }).nth(5).click();
});