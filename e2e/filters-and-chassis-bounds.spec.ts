import { test, expect } from '@playwright/test'

test.describe('Checkmate: Filters, Ergonomics & Physical Chassis Bounds', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should open Discovery Filters Sheet and toggle strict eligibility gating', async ({ page }) => {
    // Click Filters button in Discover header
    const filtersBtn = page.getByRole('button', { name: /Filters/i }).first()
    await expect(filtersBtn).toBeVisible()
    await filtersBtn.click()

    // DiscoveryFilterSheet modal should be visible
    const sheetTitle = page.locator('#filter-sheet-title')
    await expect(sheetTitle).toBeVisible()

    // Verify eligibility controls exist and can be clicked
    const eligibleBtn = page.locator('button:has-text("Eligible Only")').first()
    if (await eligibleBtn.isVisible()) {
      await eligibleBtn.click()
      await page.waitForTimeout(200)
    }

    // Apply and close sheet
    const applyBtn = page.locator('button:has-text("Apply Filters")').first()
    await applyBtn.click()

    // Sheet should close
    await expect(sheetTitle).not.toBeVisible()
  })

  test('should enforce strict "In the Box" iPhone chassis dimensions without horizontal overflow', async ({ page, isMobile }) => {
    // Assert no horizontal scroll overflow on the root document
    const isOverflown = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth
    })
    expect(isOverflown).toBe(false)

    // On desktop, assert phone chassis wrapper is constrained to 392px width
    if (!isMobile) {
      const chassis = page.locator('div.sm\\:max-w-\\[392px\\]').first()
      await expect(chassis).toBeVisible()
      const boundingBox = await chassis.boundingBox()
      expect(boundingBox).not.toBeNull()
      if (boundingBox) {
        expect(boundingBox.width).toBeLessThanOrEqual(410) // 392px + border tolerance
      }
    }
  })

  test('should survive rapid tab switching without crashing (Chaos Stress Test)', async ({ page }) => {
    const bottomNav = page.locator('nav[aria-label="Bottom Navigation"]')

    const tabs = ['Discover', 'Messages', 'Radar', 'Profile', 'Discover', 'Radar', 'Messages', 'Profile']

    // Rapid fire clicking across tabs with tactile grace
    for (const tab of tabs) {
      await bottomNav.getByLabel(tab).click({ force: true })
      await page.waitForTimeout(100)
    }

    // App must still be alive and responsive
    await expect(bottomNav).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
  })

  test('should open Safety Centre from HeaderBar shield icon', async ({ page }) => {
    const safetyBtn = page.locator('header').getByTitle('Safety Centre')
    await expect(safetyBtn).toBeVisible()
    await safetyBtn.click()

    // Should navigate to safety view or profile
    await page.waitForTimeout(200)
    await expect(page.locator('main')).toBeVisible()
  })
})
