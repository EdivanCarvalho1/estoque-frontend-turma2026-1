import { setWorldConstructor } from '@cucumber/cucumber'
import { chromium, request } from 'playwright'
import type { APIRequestContext, Browser, Page } from 'playwright'

// 👉 Config centralizada (pode extrair depois para outro arquivo)
const config = {
  baseURL: 'http://localhost:5173',
  headless: false,
  slowMo: 0
}

export class CustomWorld {
  browser?: Browser
  page?: Page
  api?: APIRequestContext
  productBarcode = ''
  orderResponseStatus?: number

  // 👉 Inicialização antes de cada cenário
  async init() {
    this.browser = await chromium.launch({
      headless: config.headless,
      slowMo: config.slowMo
    })

    this.page = await this.browser.newPage({
      baseURL: config.baseURL
    })
    this.api = await request.newContext({
      baseURL: 'http://localhost:3000'
    })
  }

  // 👉 Encerramento após cada cenário
  async close() {
    await this.page?.close()
    await this.browser?.close()
    await this.api?.dispose()
  }
}

setWorldConstructor(CustomWorld)
