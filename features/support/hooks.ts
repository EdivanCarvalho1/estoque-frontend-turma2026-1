import { Before, After } from '@cucumber/cucumber'
import { CustomWorld } from './world.ts'

Before(async function (this: CustomWorld) {
  await this.init()
})

After(async function (this: CustomWorld, scenario) {
  // 👉 screenshot em caso de erro
  if (scenario.result?.status === 'FAILED') {
    await this.page?.screenshot({
      path: `./screenshots/erro-${Date.now()}.png`,
      fullPage: true
    })
  }

  await this.close()
})