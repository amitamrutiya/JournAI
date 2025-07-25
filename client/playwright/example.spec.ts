import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe('example test', () => {
  test('should pass', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000');
    const result = await page.evaluate(() => true);
    expect(result).toBe(true);
  });
});
