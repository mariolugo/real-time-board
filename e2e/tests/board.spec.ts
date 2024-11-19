import { expect, test, type Page } from '@playwright/test';

test.describe('Kanban Board', () => {
  let page: Page;
  let page2: Page;
  let context;

  test('should show connected users when multiple clients join', async ({
    browser,
  }) => {
    // Open second browser window
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await page1.goto('http://localhost:5173');

    // Create second context and page
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto('http://localhost:5173');

    try {
      // Wait for both connections to be established
      await page1.waitForSelector('[data-testid="connected-users"]');
      await page2.waitForSelector('[data-testid="connected-users"]');

      // Check if both windows show two connected users
      const usersCount1 = await page1.locator('[data-testid^="User-"]').count();
      const usersCount2 = await page2.locator('[data-testid^="User-"]').count();

      expect(usersCount1).toBe(2);
      expect(usersCount2).toBe(2);
    } finally {
      // Cleanup
      await context1.close();
      await context2.close();
    }
  });

  test('should allow creating, editing, and moving tasks', async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://localhost:5173');

    try {
      // Create a new task
      await page.click('button:has-text("Add Task")');

      // Verify task is created in "To Do" column
      const todoColumn = page.locator('div:has-text("To Do")').first();
      await expect(todoColumn.locator('text=New Task')).toBeVisible();

      // Edit task name
      const inputElement = page.locator('input[name="task-name"]');
      await inputElement.fill('Updated Task');

      // Verify task name is updated
      await expect(todoColumn.locator('text=Updated Task')).toBeVisible();

      // Drag task to "In Progress"
      const taskElement = todoColumn.locator('text=Updated Task');
      const inProgressColumn = page
        .locator('div:has-text("In Progress")')
        .first();

      // Perform drag and drop
      await taskElement.dragTo(inProgressColumn);

      // Verify task is in new column
      await expect(inProgressColumn.locator('text=Updated Task')).toBeVisible();

      // Delete task
      await page.waitForSelector('[data-testid="delete-task"]');
      await page.click('[data-testid="delete-task"]');

    } finally {
      await context.close();
    }
  });

  test('should show real-time updates when multiple users interact', async ({
    browser,
  }) => {
    // Create two browser contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    // Create pages for both contexts
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Navigate to app in both pages
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      // User 1 creates a task
      await page1.click('button:has-text("Add Task")');

      // Verify task appears in both windows
      await expect(page1.locator('text=New Task 1').first()).toBeVisible();
      await expect(page2.locator('text=New Task 1').first()).toBeVisible();

      // User 2 edits the task
      const inputElement = page2.locator('input[name="task-name"]');
      await inputElement.fill('Updated Task');

      // Verify update appears in both windows
      await expect(page1.locator('text=Updated Task')).toBeVisible();
      await expect(page2.locator('text=Updated Task')).toBeVisible();

       // Delete task
       await page1.waitForSelector('[data-testid="delete-task"]');
       await page1.click('[data-testid="delete-task"]');
    } finally {
      // Cleanup
      await context1.close();
      await context2.close();
    }
  });

  test('should handle task deletion across multiple clients', async ({
    browser,
  }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    // Create pages for both contexts
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Navigate to app in both pages
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      // User 1 creates a task
      await page1.click('button:has-text("Add Task")');

      // Verify task appears in both windows
      await expect(page1.locator('text=New Task 1').first()).toBeVisible();
      await expect(page2.locator('text=New Task 1').first()).toBeVisible();

      // Wait for the task to be fully visible before hovering
      await page1.locator('text=New Task 1').first().waitFor({ state: 'visible' });

      // Wait for delete button to be visible and click it
      await page1.waitForSelector('[data-testid="delete-task"]');
      await page1.click('[data-testid="delete-task"]');

      // Verify task is removed from both windows
      await expect(page1.locator('text=New Task 1')).not.toBeVisible();
      await expect(page2.locator('text=New Task 1')).not.toBeVisible();
    } finally {
      // Cleanup
      await context1.close();
      await context2.close();
    } 
  });
});
