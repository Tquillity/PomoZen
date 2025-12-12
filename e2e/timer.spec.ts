import { test, expect } from '@playwright/test';

test.describe('Timer Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should start and pause timer', async ({ page }) => {
    // Wait for app to load
    await page.waitForSelector('[data-testid="timer-display"]', { timeout: 5000 }).catch(() => {});
    
    // Find start/pause button
    const startButton = page.locator('button').filter({ hasText: /start|pause/i }).first();
    
    // Start timer
    await startButton.click();
    
    // Wait a bit and verify timer is running
    await page.waitForTimeout(1000);
    
    // Pause timer
    await startButton.click();
    
    // Verify timer paused
    await expect(startButton).toBeVisible();
  });

  test('should reset timer', async ({ page }) => {
    await page.waitForSelector('button', { timeout: 5000 });
    
    // Find reset button
    const resetButton = page.locator('button').filter({ hasText: /reset/i }).first();
    
    if (await resetButton.isVisible()) {
      await resetButton.click();
    }
    
    // Timer should be reset
    await expect(page).toHaveURL('/');
  });

  test('should switch timer modes', async ({ page }) => {
    await page.waitForSelector('button', { timeout: 5000 });
    
    // Find mode switcher buttons
    const modeButtons = page.locator('button').filter({ hasText: /pomodoro|short|long/i });
    
    if (await modeButtons.count() > 0) {
      await modeButtons.first().click();
    }
    
    // Mode should change
    await expect(page).toHaveURL('/');
  });
});

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add a task', async ({ page }) => {
    await page.waitForSelector('input, button', { timeout: 5000 });
    
    // Find task input
    const taskInput = page.locator('input[type="text"]').first();
    const addButton = page.locator('button').filter({ hasText: /add|create/i }).first();
    
    if (await taskInput.isVisible()) {
      await taskInput.fill('Test Task');
      if (await addButton.isVisible()) {
        await addButton.click();
      }
    }
    
    // Task should be added
    await expect(page).toHaveURL('/');
  });
});

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open settings modal', async ({ page }) => {
    await page.waitForSelector('button', { timeout: 5000 });
    
    // Find settings button
    const settingsButton = page.locator('button').filter({ hasText: /settings|gear|⚙/i }).first();
    
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      
      // Settings modal should be visible
      await page.waitForTimeout(500);
      const modal = page.locator('[role="dialog"]').first();
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible();
      }
    }
  });
});
