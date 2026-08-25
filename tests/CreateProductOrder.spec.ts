import { expect, test } from "@playwright/test";

test("cadastra um pedido de produto", async ({ page }) => {
  await page.goto("/orders/new");

  const productSelect = page.getByTestId("product-order-product");
  await expect(productSelect).toBeVisible();
  await expect(productSelect.locator("option")).not.toHaveCount(1);
  await productSelect.selectOption({ index: 1 });

  await page.getByTestId("product-order-quantity").fill("2");
  await page
    .getByTestId("product-order-date")
    .fill(new Date().toISOString().slice(0, 10));
  await page.getByTestId("product-order-submit").click();

  await expect(page).toHaveURL(/\/orders\/[^/]+$/);
  await expect(page.getByTestId("product-order-detail")).toBeVisible();
  await expect(page.getByTestId("product-order-detail-quantity")).toHaveText("2");
  await expect(page.getByTestId("product-order-detail-status")).toBeVisible();
});
