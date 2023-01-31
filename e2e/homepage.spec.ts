import { test, expect } from '@playwright/test';

test('homepage is blank', async ({ page }) => {
	await page.goto('/');

	// Expect there to be nothing.
	const bodyText = await page.innerText('body');
	expect(bodyText).toBe('');
});
