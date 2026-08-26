import { expect, test } from "@playwright/test";

test("cadastra um pedido de produto", async ({ page }) => {

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

  await page.goto("/orders/new");

  const productSelect = page.getByTestId("product-order-product");
  await expect(productSelect).toBeVisible();
  await expect(productSelect.locator("option")).not.toHaveCount(1);
  await productSelect.selectOption({ index: 1 });

  await page.getByTestId("product-order-quantity").fill("2");
  await page
    .getByTestId("product-order-date")
    .fill(new Date("2023-01-01").toISOString().slice(0, 10));
  await page.getByTestId("product-order-submit").click();

  await expect(page).toHaveURL(/\/orders\/[^/]+$/);
  await expect(page.getByTestId("product-order-detail")).toBeVisible();
  await expect(page.getByTestId("product-order-detail-quantity")).toHaveText("2");
  await expect(page.getByTestId("product-order-detail-status")).toBeVisible();
  await expect(page.getByTestId("product-order-detail-status")).toHaveText("opened");
});
