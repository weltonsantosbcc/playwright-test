import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Testing - Welton Santos', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // 01 - Auditoria WCAG 2.2 AA
  test('01 - Verificar violações de acessibilidade WCAG', async ({ page }) => {

    const accessibilityScan = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22aa',
        'best-practice'
      ])
      .analyze();

    console.log('Violações encontradas:', accessibilityScan.violations.length);

    for (const violation of accessibilityScan.violations) {
      console.log({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        elements: violation.nodes.length
      });
    }

    expect(accessibilityScan.violations).toEqual([]);
  });

  // 02 - Imagens com texto alternativo
  test('02 - Verificar atributo ALT das imagens', async ({ page }) => {

    const images = await page.locator('img').evaluateAll(elements =>
      elements.map(image => ({
        src: (image as HTMLImageElement).src,
        alt: image.getAttribute('alt')
      }))
    );

    const missingAlt = images.filter(image => image.alt === null);

    console.log('Total de imagens:', images.length);
    console.log('Imagens sem ALT:', missingAlt);

    expect(missingAlt).toHaveLength(0);
  });

  // 03 - Idioma da página
  test('03 - Verificar idioma HTML', async ({ page }) => {

    const language = await page.locator('html').getAttribute('lang');

    console.log('Idioma:', language);

    expect(language).toBeTruthy();
  });

  // 04 - Hierarquia dos títulos
  test('04 - Verificar estrutura dos headings', async ({ page }) => {

    const headings = await page.locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll(elements =>
        elements.map(element => ({
          tag: element.tagName,
          text: element.textContent?.trim()
        }))
      );

    console.log('Headings:', headings);

    const h1 = headings.filter(heading => heading.tag === 'H1');

    expect(h1.length).toBeGreaterThan(0);
  });

  // 05 - Links acessíveis
  test('05 - Verificar nomes acessíveis dos links', async ({ page }) => {

    const links = await page.locator('a').evaluateAll(elements =>
      elements.map(link => ({
        text: link.textContent?.trim(),
        ariaLabel: link.getAttribute('aria-label'),
        title: link.getAttribute('title'),
        href: (link as HTMLAnchorElement).href
      }))
    );

    const invalidLinks = links.filter(link =>
      !link.text &&
      !link.ariaLabel &&
      !link.title
    );

    console.log('Links sem identificação:', invalidLinks);

    expect(invalidLinks).toHaveLength(0);
  });

  // 06 - Botões acessíveis
  test('06 - Verificar identificação dos botões', async ({ page }) => {

    const buttons = await page.locator('button').evaluateAll(elements =>
      elements.map(button => ({
        text: button.textContent?.trim(),
        ariaLabel: button.getAttribute('aria-label'),
        title: button.getAttribute('title')
      }))
    );

    const invalidButtons = buttons.filter(button =>
      !button.text &&
      !button.ariaLabel &&
      !button.title
    );

    console.log('Botões sem identificação:', invalidButtons);

    expect(invalidButtons).toHaveLength(0);
  });

  // 07 - Formulários e labels
  test('07 - Verificar labels dos campos', async ({ page }) => {

    const fields = await page.locator('input:not([type="hidden"]), textarea, select')
      .evaluateAll(elements =>
        elements.map(field => ({
          tag: field.tagName,
          id: field.id,
          ariaLabel: field.getAttribute('aria-label'),
          ariaLabelledby: field.getAttribute('aria-labelledby'),
          labels: (field as HTMLInputElement).labels?.length ?? 0
        }))
      );

    const invalidFields = fields.filter(field =>
      !field.ariaLabel &&
      !field.ariaLabelledby &&
      field.labels === 0
    );

    console.log('Campos sem identificação:', invalidFields);

    expect(invalidFields).toHaveLength(0);
  });

  // 08 - Navegação por teclado
  test('08 - Verificar navegação por teclado', async ({ page }) => {

    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      text: document.activeElement?.textContent?.trim(),
      role: document.activeElement?.getAttribute('role')
    }));

    console.log('Primeiro elemento focado:', focusedElement);

    expect(focusedElement.tag).not.toBe('BODY');
  });

  // 09 - Indicador visual de foco
  test('09 - Verificar indicador visual de foco', async ({ page }) => {

    await page.keyboard.press('Tab');

    const focusStyle = await page.evaluate(() => {
      const element = document.activeElement;

      if (!element) return null;

      const style = window.getComputedStyle(element);

      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
        borderStyle: style.borderStyle
      };
    });

    console.log('Estilo de foco:', focusStyle);

    expect(focusStyle).not.toBeNull();
  });

  // 10 - Verificar landmarks
  test('10 - Verificar estrutura semântica', async ({ page }) => {

    const landmarks = await page.locator(
      'header, nav, main, footer, aside, [role="main"], [role="navigation"]'
    ).count();

    console.log('Landmarks encontrados:', landmarks);

    expect(landmarks).toBeGreaterThan(0);
  });

  // 11 - Verificar viewport mobile e reflow
  test('11 - Verificar acessibilidade em viewport mobile', async ({ page }) => {

    await page.setViewportSize({
      width: 320,
      height: 800
    });

    await page.reload();

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth
    }));

    console.log('Dimensões mobile:', dimensions);

    expect(dimensions.pageWidth).toBeLessThanOrEqual(
      dimensions.viewport
    );
  });

  // 12 - Evidência visual
  test('12 - Gerar screenshot de acessibilidade', async ({ page }) => {

    await page.screenshot({
      path: 'test-results/accessibility-desktop.png',
      fullPage: true
    });

    await page.setViewportSize({
      width: 375,
      height: 812
    });

    await page.reload();

    await page.screenshot({
      path: 'test-results/accessibility-mobile.png',
      fullPage: true
    });

  });

});