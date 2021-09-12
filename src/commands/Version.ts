import { createCommand } from 'commander'
import Logger from '@leadcodedev/logger'

export default class CreateProject {
  constructor () {
  }

  public async run () {
    const jsonPackage = await import('../../package.json')
    return createCommand()
      .name('version')
      .alias('v')
      .action(() => {
        Logger.send('info', `v${jsonPackage.version}`)
      })
  }
}