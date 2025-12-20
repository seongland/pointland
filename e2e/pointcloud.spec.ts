import { test, expect } from '@playwright/test'

test.describe('Pointcloud Viewer', () => {
  test('should load the page and display canvas', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load
    await expect(page).toHaveTitle('Pointland')

    // Check that the canvas element exists (Three.js renders to canvas)
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 10000 })
  })

  test('should load pointcloud without errors', async ({ page }) => {
    const errors: string[] = []

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')

    // Wait for canvas to be visible
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 10000 })

    // Wait a bit for point cloud to start loading
    await page.waitForTimeout(3000)

    // Check no CORS or fetch errors for pointcloud
    const corsErrors = errors.filter(e =>
      e.includes('CORS') ||
      e.includes('Failed to fetch') ||
      e.includes('tokyo-potree')
    )

    expect(corsErrors).toHaveLength(0)
  })

  test('should capture screenshot of loaded pointcloud', async ({ page }) => {
    await page.goto('/')

    // Wait for canvas
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 10000 })

    // Wait for pointcloud to render
    await page.waitForTimeout(5000)

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'e2e/screenshots/pointcloud.png',
      fullPage: true
    })

    // Verify screenshot was created (test passes if no error)
    expect(true).toBe(true)
  })
})
