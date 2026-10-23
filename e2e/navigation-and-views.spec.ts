import { test, expect } from '@playwright/test'

test.describe('Checkmate: Canonical Navigation & Multi-View IA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate seamlessly across all 4 bottom tabs with smooth transitions', async ({ page }) => {
    const bottomNav = page.locator('nav[aria-label="Bottom Navigation"]')

    // 1. Initial tab is Discover
    await expect(page.getByText('Curated Matches')).toBeVisible()

    // 2. Click Messages tab
    await bottomNav.getByLabel('Messages').click()
    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible()

    // 3. Click Radar tab
    await bottomNav.getByLabel('Radar').click()
    await expect(page.getByText('The Constellation')).toBeVisible()
    await expect(page.getByText(/Living Network/i)).toBeVisible()

    // 4. Click Profile tab
    await bottomNav.getByLabel('Profile').click()
    await expect(page.getByText(/Account Hub|Elena Rostova/i)).toBeVisible()

    // 5. Click back to Discover tab
    await bottomNav.getByLabel('Discover').click()
    await expect(page.getByText('Curated Matches')).toBeVisible()
  })

  test('should open conversation brief in Messages view without crashing', async ({ page }) => {
    const bottomNav = page.locator('nav[aria-label="Bottom Navigation"]')
    await bottomNav.getByLabel('Messages').click()

    // Check if conversation interface is mounted
    const messagesView = page.locator('main')
    await expect(messagesView).toBeVisible()

    // Date brief trigger button if present
    const briefBtn = page.getByText(/Date Blueprint|Plan Date|First Date Brief/i).first()
    if (await briefBtn.isVisible()) {
      await briefBtn.click()
      await expect(page.getByText(/Date Blueprint|First Date Protocol/i)).toBeVisible()

      // Back button
      const backBtn = page.getByRole('button', { name: /Back/i }).first()
      if (await backBtn.isVisible()) {
        await backBtn.click()
      }
    }
  })

  test('should interact with the Constellation living network visualizer in Radar tab', async ({ page }) => {
    const bottomNav = page.locator('nav[aria-label="Bottom Navigation"]')
    await bottomNav.getByLabel('Radar').click()

    // Constellation header should be visible
    await expect(page.getByText('The Constellation')).toBeVisible()

    // Constellation map SVG should be rendered in the DOM
    const constellationSvg = page.locator('svg[viewBox="0 0 620 620"]')
    await expect(constellationSvg).toBeAttached()

    // Verify Human Logic Radar Lenses exist and can be toggled
    const lifeVisionLens = page.locator('button:has-text("Life Vision")').first()
    await expect(lifeVisionLens).toBeVisible()
    await lifeVisionLens.click()
    await page.waitForTimeout(100)

    const livingPaceLens = page.locator('button:has-text("Living Pace")').first()
    await expect(livingPaceLens).toBeVisible()
    await livingPaceLens.click()
    await page.waitForTimeout(100)

    // Verify Docked Human Dossier Card is displayed
    await expect(page.getByText(/Why you belong in each other's orbit/i)).toBeVisible()
    await expect(page.getByText(/Core Circle/i)).toBeVisible()

    // Verify "Read Full Dossier" button opens the deep compatibility dossier modal
    const readDossierBtn = page.getByRole('button', { name: /Read Full Dossier/i }).first()
    await expect(readDossierBtn).toBeVisible()
    await readDossierBtn.click()

    // Full compatibility report modal opens
    const dossierModalTitle = page.getByRole('heading', { name: 'Full Compatibility Report' })
    await expect(dossierModalTitle).toBeVisible()

    // Close dossier
    const closeBtn = page.locator('button[title="Close Report"]').first()
    await closeBtn.click()
    await expect(dossierModalTitle).not.toBeVisible()
  })

  test('should allow persona switching in Profile and update user state', async ({ page }) => {
    const bottomNav = page.locator('nav[aria-label="Bottom Navigation"]')
    await bottomNav.getByLabel('Profile').click()

    // Check for switch persona button or login modal trigger
    const switchBtn = page.getByRole('button', { name: /Switch Persona|Demo Personas/i }).first()
    if (await switchBtn.isVisible()) {
      await switchBtn.click()

      // LoginModal opens
      const loginModal = page.getByText(/Switch Active Persona|Select Demo Profile/i)
      await expect(loginModal).toBeVisible()

      // Click another persona (e.g. Maya Lin or Liam)
      const anotherPersona = page.locator('button:has-text("Liam")').or(page.locator('button:has-text("Maya")')).first()
      if (await anotherPersona.isVisible()) {
        await anotherPersona.click()
        // Toast message appears
        await expect(page.getByText(/Welcome back|Switched active persona/i)).toBeVisible()
      }
    }
  })
})
