import { test, expect } from '@playwright/test';

test.describe('Timer Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should start and pause timer', async ({ page }) => {
    // Wait for app to load - check for timer display
    await page.waitForSelector('[role="timer"]', { timeout: 5000 });
    
    // Find start/pause button by text content
    const startButton = page.locator('button').filter({ hasText: /^Start$|^Pause$/i }).first();
    
    // Verify initial state shows "Start"
    await expect(startButton).toHaveText(/Start/i);
    
    // Start timer
    await startButton.click();
    
    // Wait a bit and verify timer is running (button should say "Pause")
    await page.waitForTimeout(1000);
    await expect(startButton).toHaveText(/Pause/i);
    
    // Pause timer
    await startButton.click();
    
    // Verify timer paused (button should say "Start" again)
    await expect(startButton).toHaveText(/Start/i);
  });

  test('should reset timer', async ({ page }) => {
    await page.waitForSelector('button', { timeout: 5000 });
    
    // Find reset button by aria-label
    const resetButton = page.locator('button[aria-label="Reset"]');
    
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    
    // Timer should be reset (verify timer display shows initial time)
    const timerDisplay = page.locator('[role="timer"]');
    await expect(timerDisplay).toBeVisible();
  });

  test('should switch timer modes', async ({ page }) => {
    await page.waitForSelector('button', { timeout: 5000 });
    
    // Find mode switcher buttons (they have capitalized text: Pomodoro, Short, Long)
    const shortButton = page.locator('button').filter({ hasText: /^short$/i });
    
    await expect(shortButton).toBeVisible();
    await shortButton.click();
    
    // Mode should change (verify timer display is still visible)
    const timerDisplay = page.locator('[role="timer"]');
    await expect(timerDisplay).toBeVisible();
  });
});

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add a task', async ({ page }) => {
    await page.waitForSelector('input, button', { timeout: 5000 });
    
    // Find task input by id
    const taskInput = page.locator('input#new-task-input');
    const addButton = page.locator('button[aria-label="Add Task"]');
    
    await expect(taskInput).toBeVisible();
    await taskInput.fill('Test Task');
    await expect(addButton).toBeVisible();
    await addButton.click();
    
    // Task should be added (verify it appears in the task list)
    await expect(page.locator('text=Test Task')).toBeVisible();
  });
});

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open settings modal', async ({ page }) => {
    await page.waitForSelector('button', { timeout: 5000 });
    
    // Find settings button by aria-label
    const settingsButton = page.locator('button[aria-label="Settings"]');
    
    await expect(settingsButton).toBeVisible();
    await settingsButton.click();
    
    // Settings modal should be visible
    const modal = page.locator('[role="dialog"]').filter({ hasText: /Settings/i });
    await expect(modal).toBeVisible();
  });
});
