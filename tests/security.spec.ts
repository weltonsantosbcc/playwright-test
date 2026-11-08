import { test, expect } from '@playwright/test';

test.describe('Security Testing - Welton Santos', () => {

  test('01 - Validar conexão HTTPS', async ({ page }) => {

    const response = await page.goto('/');

    expect(page.url()).toContain('https://');

    expect(response?.status()).toBeLessThan(400);

  });

  test('02 - Validar Security Headers', async ({ request }) => {

    const response = await request.get('/');

    const headers = response.headers();

    console.log('Security Headers:', headers);

    expect(headers['strict-transport-security']).toBeTruthy();

    expect(headers['x-content-type-options']).toBe('nosniff');

    expect(
      headers['content-security-policy'] ||
      headers['x-frame-options']
    ).toBeTruthy();

  });

  test('03 - Validar cookies seguros', async ({ page, context }) => {

    await page.goto('/');

    const cookies = await context.cookies();

    for (const cookie of cookies) {

      console.log({
        name: cookie.name,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite
      });

      expect(cookie.secure).toBeTruthy();

    }

  });

  test('04 - Validar ausência de Mixed Content', async ({ page }) => {

    const insecureRequests: string[] = [];

    page.on('request', request => {

      if (request.url().startsWith('http://')) {
        insecureRequests.push(request.url());
      }

    });

    await page.goto('/', { waitUntil: 'networkidle' });

    expect(insecureRequests).toHaveLength(0);

  });

  test('05 - Verificar arquivos sensíveis', async ({ request }) => {

    const paths = [
      '/.env',
      '/.git/HEAD',
      '/wp-config.php',
      '/config.php',
      '/backup.zip',
      '/database.sql'
    ];

    for (const path of paths) {

      const response = await request.get(path);

      console.log(`${path}: HTTP ${response.status()}`);

      if (response.status() === 200) {

        const body = await response.text();

        expect(body).not.toMatch(
          /DB_PASSWORD|SECRET_KEY|PRIVATE KEY/i
        );

      }

    }

  });

  test('06 - Verificar método HTTP TRACE', async ({ request }) => {

    const response = await request.fetch('/', {
      method: 'OPTIONS'
    });

    const allow = response.headers()['allow'] || '';

    console.log('Métodos permitidos:', allow);

    expect(allow.toUpperCase()).not.toContain('TRACE');

  });

  test('07 - Verificar links externos', async ({ page }) => {

    await page.goto('/');

    const links = await page.locator('a[target="_blank"]').evaluateAll(
      elements => elements.map(element => ({
        href: (element as HTMLAnchorElement).href,
        rel: element.getAttribute('rel') || ''
      }))
    );

    for (const link of links) {

      console.log(link);

      expect(link.rel.split(/\s+/)).toContain('noopener');

    }

  });

  test('08 - Verificar formulários', async ({ page }) => {

    await page.goto('/');

    const forms = await page.locator('form').evaluateAll(forms =>
      forms.map(form => ({
        action: (form as HTMLFormElement).action,
        method: (form as HTMLFormElement).method
      }))
    );

    for (const form of forms) {

      console.log(form);

      expect(
        form.action.startsWith('https://') ||
        form.action === ''
      ).toBeTruthy();

    }

  });

  test('09 - Verificar erros JavaScript', async ({ page }) => {

    const errors: string[] = [];

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/');

    console.log('JavaScript Errors:', errors);

    expect(errors).toHaveLength(0);

  });

  test('10 - Verificar exposição de informações', async ({ request }) => {

    const response = await request.get('/');

    const body = await response.text();

    expect(body).not.toMatch(
      /Traceback \(most recent call last\)|SQLSTATE\[|Stack trace:/i
    );

  });

  test('11 - Verificar links internos', async ({ page }) => {

    await page.goto('/');

    const links = await page.locator('a[href]').evaluateAll(elements =>
      elements
        .map(element => (element as HTMLAnchorElement).href)
        .filter(url => url.startsWith('https://weltonsantos.com.br'))
    );

    const uniqueLinks = [...new Set(links)];

    for (const link of uniqueLinks.slice(0, 30)) {

      const response = await page.request.get(link);

      console.log(`${response.status()} - ${link}`);

      expect(response.status()).toBeLessThan(400);

    }

  });

  test('12 - Validar carregamento da página', async ({ page }) => {

    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    await page.screenshot({
      path: 'test-results/security-homepage.png',
      fullPage: true
    });

  });

});