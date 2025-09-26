import { test, expect } from '@playwright/test';

test.describe('Reports System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for testing
    await page.addInitScript(() => {
      // Mock localStorage for authentication
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user',
        name: 'Test User',
        email: 'admin@instituto.edu',
        role: 'admin'
      }));
    });
  });

  test('@smoke @e2e should navigate to reports page and display admin view', async ({ page }) => {
    await page.goto('/reports');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the reports page loads
    await expect(page).toHaveTitle(/Reports|Reportes/);
    
    // Check that admin view is displayed (should show global stats)
    await expect(page.locator('text=Total Students')).toBeVisible();
    await expect(page.locator('text=Total Courses')).toBeVisible();
  });

  test('@e2e should display cohort progress chart', async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Check that the cohort progress chart is displayed
    await expect(page.locator('[data-testid="cohort-progress-chart"]')).toBeVisible();
  });

  test('@e2e should display KPI cards', async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Check that KPI cards are displayed
    await expect(page.locator('text=Average Submissions')).toBeVisible();
    await expect(page.locator('text=Delay Percentage')).toBeVisible();
    await expect(page.locator('text=Active Students')).toBeVisible();
    await expect(page.locator('text=Courses Monitored')).toBeVisible();
  });

  test('@e2e should handle role-based access for student', async ({ page }) => {
    // Mock student role
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-student',
        name: 'Test Student',
        email: 'student@instituto.edu',
        role: 'student'
      }));
    });

    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Check that student view is displayed (personal progress only)
    await expect(page.locator('text=Mi Progreso')).toBeVisible();
  });

  test('@e2e should handle role-based access for teacher', async ({ page }) => {
    // Mock teacher role
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-teacher',
        name: 'Test Teacher',
        email: 'teacher@instituto.edu',
        role: 'teacher'
      }));
    });

    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Check that teacher view is displayed
    await expect(page.locator('text=Mis Estudiantes')).toBeVisible();
  });

  test('@e2e should handle role-based access for coordinator', async ({ page }) => {
    // Mock coordinator role
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-coordinator',
        name: 'Test Coordinator',
        email: 'coord.ecommerce@instituto.edu',
        role: 'coordinator'
      }));
    });

    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Check that coordinator view is displayed
    await expect(page.locator('text=Reportes Globales')).toBeVisible();
  });

  test('@e2e should redirect unauthorized users to login', async ({ page }) => {
    // Clear authentication
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto('/reports');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('@e2e should protect students search route', async ({ page }) => {
    // Mock student role
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-student',
        name: 'Test Student',
        email: 'student@instituto.edu',
        role: 'student'
      }));
    });

    await page.goto('/students');
    await page.waitForLoadState('networkidle');
    
    // Should show access denied or redirect
    await expect(page.locator('text=Acceso Denegado')).toBeVisible();
  });

  test('@e2e should allow teachers to access students search', async ({ page }) => {
    // Mock teacher role
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-teacher',
        name: 'Test Teacher',
        email: 'teacher@instituto.edu',
        role: 'teacher'
      }));
    });

    await page.goto('/students');
    await page.waitForLoadState('networkidle');
    
    // Should show students page
    await expect(page.locator('text=Estudiantes')).toBeVisible();
  });

  test('@e2e should display demo mode indicator', async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Check that demo mode indicator is displayed
    await expect(page.locator('text=MOCK')).toBeVisible();
  });

  test('@e2e should handle loading states', async ({ page }) => {
    // Slow down network to test loading states
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 1000);
    });

    await page.goto('/reports');
    
    // Check that loading state is displayed
    await expect(page.locator('text=Cargando')).toBeVisible();
  });

  test('@e2e should handle error states', async ({ page }) => {
    // Mock API error
    await page.route('**/api/v1/reports/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Check that error state is displayed
    await expect(page.locator('text=Error')).toBeVisible();
  });
});
