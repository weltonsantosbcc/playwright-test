
import { test, expect } from '@playwright/test';

test.describe('Inspeção do site Welton Santos', () => {

test('Validar carregamento da página inicial', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/.+/);
  await expect(page.locator('body')).toBeVisible();

  // Scroll até o final da página
  await page.evaluate(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  });

  await page.waitForTimeout(2000);

  // Scroll de volta ao topo
  await page.evaluate(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  await page.waitForTimeout(2000);

  // Capturar screenshot da página inteira
  await page.screenshot({
    path: 'test-results/homepage.png',
    fullPage: true,
  });
});

  test('Validar disponibilidade do site', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

  });


  test('test usabilidade', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Sobre' }).click();
  await page.getByRole('link', { name: 'Portfólio' }).click();
  await page.getByRole('link', { name: 'Publicações' }).click();
  await page.getByRole('link', { name: 'Contato' }).click();
  await page.locator('#bdt-ep-grid-filters9b37243').getByText('Analise de dados').click();
  await page.locator('#bdt-ep-grid-filters9b37243').getByText('Case').click();
  await page.locator('#bdt-ep-grid-filters9b37243').getByText('Front-end').click();
  await page.locator('#bdt-ep-grid-filters9b37243').getByText('UI').click();
  await page.locator('#bdt-ep-grid-filters9b37243').getByText('Todos').click();
  await page.getByRole('link', { name: 'Redesign interface QuickCondo' }).click();
});

});


