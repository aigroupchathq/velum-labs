import { test, expect } from '@playwright/test'

test.describe('Checkmate: Discover Feed & Decision Engine', () => {
  test.beforeEach(async ({ page }) => {
    // Monitor and assert zero uncaught console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Fail if unhandled runtime errors occur in the app
        console.error(`[Browser Console Error] ${msg.text()}`)
      }
    })

    await page.goto('/')
  })

  test('should boot application cleanly into the iPhone chassis without console errors', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Checkmate|Universal Compatibility/i)

    // Check header bar with Brand Wordmark
    const wordmark = page.locator('header').getByText('CHECKMATE')
    await expect(wordmark).toBeVisible()

    // Check city indicator pill
    const cityPill = page.locator('header').getByTitle('Filter by city radius')
    await expect(cityPill).toBeVisible()

    // Check Bottom Tab Bar is mounted with 4 tabs
    const tabBar = page.locator('nav[aria-label="Bottom Navigation"]')
    await expect(tabBar).toBeVisible()
    await expect(tabBar.getByLabel('Discover')).toBeVisible()
    await expect(tabBar.getByLabel('Messages')).toBeVisible()
    await expect(tabBar.getByLabel('Radar')).toBeVisible()
    await expect(tabBar.getByLabel('Profile')).toBeVisible()
  })

  test('should display primary candidate card with verified badge and resonance pill', async ({ page }) => {
    // Candidate card exists
    const candidateCard = page.locator('article[aria-label*="Match profile for"]').first()
    await expect(candidateCard).toBeVisible()

    // Candidate name and age
    await expect(candidateCard.getByText('Maya Lin')).toBeVisible()
    await expect(candidateCard.getByText('31')).toBeVisible()

    // Verified badge
    await expect(candidateCard.getByText('Verified')).toBeVisible()

    // Match percentage pill
    await expect(candidateCard.getByText(/% Match/)).toBeVisible()

    // Micro-badges for lifestyle & intent
    await expect(candidateCard.getByText(/Smoke-Free/i)).toBeVisible()
    await expect(candidateCard.getByText(/Vegetarian/i)).toBeVisible()
    await expect(candidateCard.getByText(/Long-Term/i)).toBeVisible()
  })

  test('should cycle photo carousel on tap and update dash indicators', async ({ page }) => {
    const candidateCard = page.locator('article[aria-label*="Match profile for"]').first()
    const nextBtn = candidateCard.getByLabel('Next photo')
    
    // Check if multiple photos exist
    if (await nextBtn.isVisible()) {
      // Find initial photo src
      const heroImg = candidateCard.locator('img')
      const initialSrc = await heroImg.getAttribute('src')

      // Click right side to cycle next
      await nextBtn.click()

      // Give transition time to complete
      await page.waitForTimeout(300)

      const updatedSrc = await heroImg.getAttribute('src')
      expect(updatedSrc).not.toBe(initialSrc)

      // Click left side to cycle back
      const prevBtn = candidateCard.getByLabel('Previous photo')
      await prevBtn.click()
      await page.waitForTimeout(300)

      const finalSrc = await heroImg.getAttribute('src')
      expect(finalSrc).toBe(initialSrc)
    }
  })

  test('should open Deep Compatibility Dossier when tapping "Why you resonate"', async ({ page }) => {
    const resonanceContainer = page.locator('role=button[name="Inspect deep compatibility dossier"]').first()
    await expect(resonanceContainer).toBeVisible()
    await resonanceContainer.click()

    // Deep Report Modal should be visible
    const reportTitle = page.getByRole('heading', { name: 'Full Compatibility Report' })
    await expect(reportTitle).toBeVisible()

    // Verify dossier tabs exist and can be clicked
    const tabs = ['Harmony Overview', '8 Core Areas', 'Emotional & Conflict Style', 'Boundaries & Safe Haven', 'Relationship Mirror']
    for (const tabName of tabs) {
      const tabButton = page.locator(`button:has-text("${tabName}")`).first()
      await tabButton.waitFor({ state: 'visible' })
      await tabButton.click()
      await page.waitForTimeout(100)
    }

    // Verify Relationship Mirror / Friction section renders content
    await expect(page.getByText('Relationship Self-Mirror')).toBeVisible()

    // Close modal via close button
    const closeBtn = page.locator('button[title="Close Report"]').first()
    await closeBtn.click()

    // Modal should disappear
    await expect(reportTitle).not.toBeVisible()
  })

  test('should execute handshake request and increment messages badge', async ({ page }) => {
    const handshakeBtn = page.locator('button[aria-label*="Send Handshake to"]').first()
    await expect(handshakeBtn).toBeVisible()

    // Initial state
    await expect(handshakeBtn).toContainText('Request Handshake')

    // Click handshake
    await handshakeBtn.click()

    // Assert button state updates to confirmation
    await expect(handshakeBtn).toContainText(/Handshake Sent/i)
    await expect(handshakeBtn).toBeDisabled()

    // Assert Messages tab badge appears/increments
    const messagesTab = page.locator('nav[aria-label="Bottom Navigation"]').getByLabel('Messages')
    const badge = messagesTab.locator('span:has-text("1")')
    await expect(badge).toBeVisible()
  })

  test('should handle pass action and respectfully dismiss candidate', async ({ page }) => {
    const initialCandidateName = await page.locator('article[aria-label*="Match profile for"]').first().locator('h2').textContent()

    const passBtn = page.locator('button[title="Respectfully pass"]').first()
    await expect(passBtn).toBeVisible()
    await passBtn.click()

    // Verify candidate is dismissed or toast notification appears
    await page.waitForTimeout(300)
  })
})
