import { test, expect } from '@playwright/test';

const devices = [
  { name: 'Desktop Full HD', width: 1920, height: 1080 },
  { name: 'Desktop', width: 1366, height: 768 },
  { name: 'Notebook', width: 1280, height: 720 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 390, height: 844 },
  { name: 'Mobile Small', width: 320, height: 568 }
];

test.describe('Responsive Testing - Welton Santos', () => {

  test('01 - Verificar carregamento em todas as resoluções', async ({ page }) => {

    for (const device of devices) {

      await page.setViewportSize({
        width: device.width,
        height: device.height
      });

      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();

      console.log(`PASS: ${device.name}`);

    }

  });

  test('02 - Verificar scroll horizontal', async ({ page }) => {

    for (const device of devices) {

      await page.setViewportSize({
        width: device.width,
        height: device.height
      });

      await page.goto('/');

      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        page: document.documentElement.scrollWidth
      }));

      console.log(device.name, dimensions);

      expect(dimensions.page).toBeLessThanOrEqual(
        dimensions.viewport
      );

    }

  });

  test('03 - Verificar imagens responsivas', async ({ page }) => {

    await page.goto('/');

    const images = await page.locator('img').evaluateAll(elements =>
      elements.map(image => {
        const rect = image.getBoundingClientRect();

        return {
          src: (image as HTMLImageElement).src,
          width: rect.width,
          naturalWidth: (image as HTMLImageElement).naturalWidth
        };
      })
    );

    for (const image of images) {

      console.log(image);

      expect(image.width).toBeGreaterThan(0);

      expect(image.width).toBeLessThanOrEqual(
        await page.evaluate(() => document.documentElement.clientWidth)
      );

    }

  });

  test('04 - Verificar elementos fora da viewport', async ({ page }) => {

    await page.goto('/');

    for (const device of devices) {

      await page.setViewportSize({
        width: device.width,
        height: device.height
      });

      const elementsOutside = await page.locator('body *').evaluateAll(elements => {

        return elements
          .filter(element => {
            const rect = element.getBoundingClientRect();

            return rect.width > 0 &&
              (rect.left < -1 || rect.right > window.innerWidth + 1);
          })
          .map(element => ({
            tag: element.tagName,
            className: (element as HTMLElement).className,
            left: element.getBoundingClientRect().left,
            right: element.getBoundingClientRect().right
          }));

      });

      console.log(device.name, elementsOutside);

    }

  });

  test('05 - Verificar visibilidade do menu', async ({ page }) => {

    await page.setViewportSize({
      width: 390,
      height: 844
    });

    await page.goto('/');

    const navigation = page.locator('nav');

    if (await navigation.count() > 0) {
      console.log('Menu encontrado:', await navigation.isVisible());
    }

    await expect(page.locator('body')).toBeVisible();

  });

  test('06 - Verificar textos e transbordamento', async ({ page }) => {

    await page.goto('/');

    const textElements = await page.locator('h1, h2, h3, p').evaluateAll(elements =>
      elements.map(element => ({
        tag: element.tagName,
        text: element.textContent?.trim(),
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth
      }))
    );

    const overflow = textElements.filter(
      element => element.scrollWidth > element.clientWidth + 1
    );

    console.log('Textos com possível overflow:', overflow);

    expect(overflow).toHaveLength(0);

  });

  test('07 - Verificar botões em mobile', async ({ page }) => {

    await page.setViewportSize({
      width: 390,
      height: 844
    });

    await page.goto('/');

    const buttons = await page.locator('button, input[type="button"], input[type="submit"], a').evaluateAll(elements =>
      elements.map(element => ({
        tag: element.tagName,
        visible: (element as HTMLElement).getBoundingClientRect().width > 0,
        text: element.textContent?.trim()
      }))
    );

    console.log('Elementos interativos:', buttons);

    expect(buttons.length).toBeGreaterThan(0);

  });

  test('08 - Verificar layout tablet', async ({ page }) => {

    await page.setViewportSize({
      width: 768,
      height: 1024
    });

    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    await page.screenshot({
      path: 'test-results/responsive-tablet.png',
      fullPage: true
    });

  });

  test('09 - Verificar layout mobile', async ({ page }) => {

    await page.setViewportSize({
      width: 390,
      height: 844
    });

    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    await page.screenshot({
      path: 'test-results/responsive-mobile.png',
      fullPage: true
    });

  });

  test('10 - Gerar evidências de todas as resoluções', async ({ page }) => {

    for (const device of devices) {

      await page.setViewportSize({
        width: device.width,
        height: device.height
      });

      await page.goto('/');

      const fileName = device.name
        .toLowerCase()
        .replaceAll(' ', '-');

      await page.screenshot({
        path: `test-results/${fileName}.png`,
        fullPage: true
      });

      console.log(`Screenshot gerado: ${fileName}`);

    }

  });

});