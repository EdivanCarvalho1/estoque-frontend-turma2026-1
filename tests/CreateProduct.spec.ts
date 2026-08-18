import { test, expect } from '@playwright/test';

test('should create a new product with success', async ({ page }) => {

  const barcode = Date.now().toString();
  const name = 'Coca-Cola' + barcode;

  await page.goto('/');
  await page.getByRole('link', { name: 'Produtos', exact: true }).click();
  await page.getByRole('link', { name: 'Novo Produto' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Código de Barras' }).fill(barcode);
  await page.getByRole('textbox', { name: 'Nome' }).fill(name);
  await page.getByRole('button', { name: 'Criar Produto' }).click();
  await page.waitForTimeout(500);
  await expect(page.getByText('Produto criado com sucesso!')).toBeVisible();
  await expect(page.getByTestId('product-barcode')).toHaveText(barcode);
  await expect(page.getByTestId('product-name')).toHaveText(name);
  await expect(page.getByTestId('product-quantity')).toHaveText('0');
  await page.waitForTimeout(2000);  
});