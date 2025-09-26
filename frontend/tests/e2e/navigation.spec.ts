import { test, expect } from '@playwright/test';

test.describe('Complete Navigation Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for testing
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user',
        name: 'Test User',
        email: 'admin@instituto.edu',
        role: 'admin'
      }));
    });
  });

  test('@e2e complete flow: login → overview → students → profile → reports', async ({ page }) => {
    // Step 1: Navigate to overview (simulating login)
    await page.goto('/overview');
    await page.waitForLoadState('networkidle');
    
    // Verify overview page loads
    await expect(page.locator('text=Dashboard Overview')).toBeVisible();
    await expect(page.locator('text=Total Students')).toBeVisible();
    
    // Step 2: Navigate to students page
    await page.goto('/students');
    await page.waitForLoadState('networkidle');
    
    // Verify students page loads
    await expect(page.locator('text=Estudiantes')).toBeVisible();
    
    // Step 3: Navigate to student profile
    await page.goto('/students/student_001');
    await page.waitForLoadState('networkidle');
    
    // Verify student profile loads
    await expect(page.locator('text=Student Profile')).toBeVisible();
    
    // Step 4: Navigate to reports
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Verify reports page loads
    await expect(page.locator('text=Total Students')).toBeVisible();
    await expect(page.locator('text=Total Courses')).toBeVisible();
    
    // Verify all pages loaded successfully (no errors)
    await expect(page.locator('text=Error')).not.toBeVisible();
  });

  test('@e2e teacher flow: login → reports → students → profile', async ({ page }) => {
    // Mock teacher role
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-teacher',
        name: 'Test Teacher',
        email: 'teacher@instituto.edu',
        role: 'teacher'
      }));
    });

    // Step 1: Navigate to reports
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Verify teacher reports view
    await expect(page.locator('text=Mis Estudiantes')).toBeVisible();
    
    // Step 2: Navigate to students
    await page.goto('/students');
    await page.waitForLoadState('networkidle');
    
    // Verify students page loads for teacher
    await expect(page.locator('text=Estudiantes')).toBeVisible();
    
    // Step 3: Navigate to student profile
    await page.goto('/students/student_001');
    await page.waitForLoadState('networkidle');
    
    // Verify student profile loads
    await expect(page.locator('text=Student Profile')).toBeVisible();
  });

  test('@e2e student flow: login → reports (personal view only)', async ({ page }) => {
    // Mock student role
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-student',
        name: 'Test Student',
        email: 'student@instituto.edu',
        role: 'student'
      }));
    });

    // Step 1: Navigate to reports
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Verify student reports view (personal progress only)
    await expect(page.locator('text=Mi Progreso')).toBeVisible();
    
    // Step 2: Try to access students page (should be denied)
    await page.goto('/students');
    await page.waitForLoadState('networkidle');
    
    // Verify access is denied
    await expect(page.locator('text=Acceso Denegado')).toBeVisible();
  });

  test('@e2e coordinator flow: login → reports → students → profile', async ({ page }) => {
    // Mock coordinator role
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-coordinator',
        name: 'Test Coordinator',
        email: 'coord.ecommerce@instituto.edu',
        role: 'coordinator'
      }));
    });

    // Step 1: Navigate to reports
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Verify coordinator reports view
    await expect(page.locator('text=Reportes Globales')).toBeVisible();
    
    // Step 2: Navigate to students
    await page.goto('/students');
    await page.waitForLoadState('networkidle');
    
    // Verify students page loads for coordinator
    await expect(page.locator('text=Estudiantes')).toBeVisible();
    
    // Step 3: Navigate to student profile
    await page.goto('/students/student_001');
    await page.waitForLoadState('networkidle');
    
    // Verify student profile loads
    await expect(page.locator('text=Student Profile')).toBeVisible();
  });

  test('@e2e should maintain authentication across navigation', async ({ page }) => {
    // Navigate to overview
    await page.goto('/overview');
    await page.waitForLoadState('networkidle');
    
    // Verify user is authenticated
    await expect(page.locator('text=Test User')).toBeVisible();
    
    // Navigate to reports
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Verify user is still authenticated
    await expect(page.locator('text=Test User')).toBeVisible();
    
    // Navigate to students
    await page.goto('/students');
    await page.waitForLoadState('networkidle');
    
    // Verify user is still authenticated
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('@e2e should handle logout and redirect to login', async ({ page }) => {
    // Navigate to overview
    await page.goto('/overview');
    await page.waitForLoadState('networkidle');
    
    // Click logout button
    await page.click('text=Cerrar Sesión');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('@e2e should display correct role-based content', async ({ page }) => {
    // Navigate to reports
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Verify admin content is displayed
    await expect(page.locator('text=Total Students')).toBeVisible();
    await expect(page.locator('text=Total Courses')).toBeVisible();
    
    // Verify role-specific content
    await expect(page.locator('text=administrador')).toBeVisible();
  });

  test('@e2e should handle page refresh and maintain state', async ({ page }) => {
    // Navigate to reports
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    await expect(page.locator('text=Total Students')).toBeVisible();
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify page still loads correctly
    await expect(page.locator('text=Total Students')).toBeVisible();
  });
});
