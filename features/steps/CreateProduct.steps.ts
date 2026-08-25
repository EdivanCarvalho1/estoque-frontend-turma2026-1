import { Given, When, Then } from '@cucumber/cucumber'
import { CustomWorld } from '../support/world.ts'
import { expect } from '@playwright/test';

const barcode = Date.now().toString();
const name = 'Coca-Cola' + barcode;

Given('que estou na tela de cadastro', async function (this: CustomWorld) {
    await this.page!.goto('/');
    await this.page!.getByRole('link', { name: 'Produtos', exact: true }).click();
    await this.page!.getByRole('link', { name: 'Novo Produto' }).click();
    await this.page!.waitForTimeout(500);
})

When('preencho os dados do produto', async function (this: CustomWorld) {
  await this.page!.getByRole('textbox', { name: 'Código de Barras' }).fill(barcode);
  await this.page!.getByRole('textbox', { name: 'Nome' }).fill(name);  
})

When('solicito o cadastro', async function (this: CustomWorld) {
  await this.page!.getByRole('button', { name: 'Criar Produto' }).click();
  await this.page!.waitForTimeout(500);
})

Then('devo ver os dados do produto cadastrado com estoque = 0', async function (this: CustomWorld) {
  await expect(this.page!.getByText('Produto criado com sucesso!')).toBeVisible();
  await expect(this.page!.getByTestId('product-barcode')).toHaveText(barcode);
  await expect(this.page!.getByTestId('product-name')).toHaveText(name);
  await expect(this.page!.getByTestId('product-quantity')).toHaveText('0');
  await this.page!.waitForTimeout(2000); 
})