import { program } from 'commander'
import Logger from '@leadcodedev/logger'
import { isUsingYarn, clearLastedLine, motd, createEnvironment } from '../utils'
import { spawn } from 'cross-spawn'
import fs from 'fs'
import YAML from 'js-yaml'
import path from 'path'
import cliSpinners from 'cli-spinners'

export default class CreateProject {
  public async run () {
    const jsonPackage = await import('../../package.json')

    program
      .name(jsonPackage.name)
      .argument('<project-name>', 'the name of your project')
      .argument('<environment>', 'Define your bot environment "json" or "yaml"')
      .argument('[token]', 'Your secret bot token', 'Your token')
      .action(async (projectName) => {
        motd()
        await this.cloneGithubRepository(projectName)
      })
  }

  private async cloneGithubRepository (projectName: string) {
    const child = spawn('git', ['clone', '--progress', 'https://github.com/DiscordFactory/Factory.git', projectName])

    child.on('spawn', () => {
      Logger.send('info', `Creation of project ${projectName} in progress.`)
    })

    child.on('close', async (code) => {
      if (code) {
        const status: { [K in number]: () => void } = {
          128: () => {
            clearLastedLine()
            Logger.send('error', 'The location already contains a folder with the same name.')
          }
        }
        status[code]()
      }
      else {
        const [projectName, environmentType, token] = program.args

        environmentType === 'yaml'
          ? await this.createYaml({ token, projectName })
          : await this.createJson({ token, projectName })

        await Promise.all([
          fs.promises.rm(path.join(process.cwd(), projectName, '.git'), { recursive: true }),
          fs.promises.rm(path.join(process.cwd(), projectName, '.github'), { recursive: true })
        ])

        clearLastedLine()
        Logger.send('success', `The project was initiated in the ${projectName} folder.`)
        this.install(path.join(process.cwd(), projectName), isUsingYarn(), projectName)
      }
    })
  }

  protected async createJson (params: { projectName: string, token: string }) {
    await fs.promises.writeFile(
      path.join(process.cwd(), params.projectName, 'environment.dev.json'),
      JSON.stringify(createEnvironment(params), null, ' ')
    )

    await fs.promises.writeFile(
      path.join(process.cwd(), params.projectName, 'environment.prod.json'),
      JSON.stringify(createEnvironment(params), null, ' ')
    )
  }

  protected async createYaml (params: { projectName: string, token: string }) {
    await fs.promises.writeFile(
      path.join(process.cwd(), params.projectName, 'environment.dev.yaml'),
      YAML.dump(createEnvironment(params))
    )

    await fs.promises.writeFile(
      path.join(process.cwd(), params.projectName, 'environment.prod.yaml'),
      YAML.dump(createEnvironment(params))
    )
  }

  private install (root: string, useYarn: boolean, projectName: string) {
    const child = spawn(useYarn ? 'yarn' : 'npm', ['install', '--cwd', root])
    const startCommand = useYarn ? 'yarn dev' : 'npm run dev'

    let interval: NodeJS.Timer
    let count = -1
    const { interval: recommendedInterval, frames } = cliSpinners.line
    child
      .on('spawn', () => {
        interval = setInterval(() => {
          count >= 0 && clearLastedLine()
          count === 3 ? count = 0 : count++
          Logger.send('info', `Installation of outbuildings ${frames[count]}`)
        }, recommendedInterval)
      })
      .on('close', (code) => {
        if (!code) {
          clearInterval(interval)
          clearLastedLine()
          Logger.send('success', 'The project outbuildings have been installed.')

          process.stdout.write(`
      ╭─────────────────────────────────────────────────╮
      │    Run following commands to get started        │
      │─────────────────────────────────────────────────│
      │                                                 │
      │    ❯ cd ./${projectName}${' '.repeat(38 - projectName.length)}│
      │    ❯ ${startCommand}${' '.repeat(43 - startCommand.length) }│
      │                                                 │
      ╰─────────────────────────────────────────────────╯\n`)
          process.exit(0)
        }
      })
  }
}