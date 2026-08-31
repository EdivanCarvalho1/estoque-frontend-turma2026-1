import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../support/world.ts'

const today = () => new Date().toISOString().slice(0, 10)

Given('que estou na tela de cadastro de pedido', async function (this: CustomWorld) {
  this.productBarcode = `pedido-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  const productResponse = await this.api!.post('/products', {
    data: {
      barcode: this.productBarcode,
      name: `Produto para pedido ${this.productBarcode}`,
    },
  })
  expect(productResponse.status()).toBe(201)

  await this.page!.goto('/orders/new')
  const productSelect = this.page!.getByTestId('product-order-product')
  await expect(productSelect).toBeVisible()
  await expect(productSelect.locator('option')).not.toHaveCount(1)
})

When('preencho um pedido válido com quantidade {int}', async function (this: CustomWorld, quantity: number) {
  await this.page!.getByTestId('product-order-product').selectOption(this.productBarcode)
  await this.page!.getByTestId('product-order-quantity').fill(String(quantity))
  await this.page!.getByTestId('product-order-date').fill(today())
})

When('preencho um pedido com quantidade {int}', async function (this: CustomWorld, quantity: number) {
  await this.page!.getByTestId('product-order-product').selectOption(this.productBarcode)
  await this.page!.getByTestId('product-order-quantity').fill(String(quantity))
  await this.page!.getByTestId('product-order-date').fill(today())
  await this.page!.getByTestId('product-order-form').evaluate((form) => {
    form.setAttribute('novalidate', '')
  })
})

When('solicito o cadastro do pedido', async function (this: CustomWorld) {
  const responsePromise = this.page!.waitForResponse((response) =>
    response.url().endsWith('/product-orders') && response.request().method() === 'POST',
  )

  await this.page!.getByTestId('product-order-submit').click()
  this.orderResponseStatus = (await responsePromise).status()
})

Then('devo ver os detalhes do pedido com quantidade {int} e status {string}', async function (
  this: CustomWorld,
  quantity: number,
  status: string,
) {
  expect(this.orderResponseStatus).toBe(201)
  await expect(this.page!).toHaveURL(/\/orders\/[^/]+$/)
  await expect(this.page!.getByTestId('product-order-detail')).toBeVisible()
  await expect(this.page!.getByTestId('product-order-detail-quantity')).toHaveText(String(quantity))
  await expect(this.page!.getByTestId('product-order-detail-status')).toHaveText(status)
})

Then('devo ver o erro de pedido {string}', async function (this: CustomWorld, errorMessage: string) {
  expect(this.orderResponseStatus).toBe(400)
  await expect(this.page!).toHaveURL(/\/orders\/new$/)
  await expect(this.page!.getByText(errorMessage, { exact: true }).first()).toBeVisible()
})
