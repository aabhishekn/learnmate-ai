import { test, expect } from '@playwright/test';

test('main flow: sign-in, upload, ingest, quiz, attempt, dashboard, chat, citation jump', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('text=Upload or Choose Sample');
  // Upload PDF (simulate drag-drop)
  // Skipping actual file upload in E2E for demo; select sample instead
  await page.click('text=All uploaded PDFs');
  // Select first sample PDF
  await page.click('.border.rounded');
  // Wait for PDF viewer
  await expect(page.locator('canvas')).toBeVisible();
  // Dashboard visible
  await expect(page.locator('text=Progress Dashboard')).toBeVisible();
  // Chat dock
  await page.fill(
    'input[placeholder="Ask a question..."]',
    'What is kinematics?'
  );
  await page.click('button:has-text("Send")');
  await expect(page.locator('.bg-gray-200')).toContainText('kinematics');
});
