import { expect, test, type Page } from '@playwright/test';

const futureToken = () => {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
  return `header.${payload}.signature`;
};

const mockAuthentication = async (page: Page, codRol = 1) => {
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: futureToken(), codUsuario: 17, username: 'cramos   ', codRol })
    });
  });
  await page.route('**/auth/logout', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, message: 'Sesión cerrada' })
  }));
};

test('la aplicación abre el formulario de autenticación', async ({ page }) => {
  await page.goto('/login');

  await expect(page).toHaveTitle(/Rentas MDE/i);
  await expect(page.getByRole('textbox').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrar al Sistema' })).toBeVisible();
});

test('inicia y cierra sesión conservando la identidad sólo durante la sesión activa', async ({ page }) => {
  await mockAuthentication(page, 1);
  await page.goto('/login');

  await page.getByLabel('Nombre de Usuario').fill('cramos');
  await page.getByLabel('Contraseña').fill('secreto');
  await page.getByRole('button', { name: 'Entrar al Sistema' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Módulo no disponible' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('auth_token'))).not.toBeNull();

  await page.getByRole('button', { name: 'Abrir menú de usuario' }).click();
  await page.getByText('Cerrar Sesión').click();

  await expect(page).toHaveURL(/\/login$/);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('auth_token'))).toBeNull();
});

test('un cajero autenticado recibe acceso denegado en una operación tributaria no autorizada', async ({ page }) => {
  await mockAuthentication(page, 3);
  await page.goto('/login');
  await page.getByLabel('Nombre de Usuario').fill('cajero');
  await page.getByLabel('Contraseña').fill('secreto');
  await page.getByRole('button', { name: 'Entrar al Sistema' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto('/predio/nuevo');
  await expect(page.getByRole('heading', { name: 'Acceso no autorizado' })).toBeVisible();
});
