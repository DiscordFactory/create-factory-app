import { execSync } from 'child_process'
import Colors from './Colors'
import { join } from 'path'
import fs from 'fs'

export function motd () {
  process.stdout.write(`${Colors.TextCyan}\n`
    + '\n'
    + '███████╗   █████╗    ██████╗ ████████╗   ██████╗    ██████╗   ██╗   ██╗\n'
    + '██╔════╝  ██╔══██╗  ██╔════╝ ╚══██╔══╝  ██╔═══██╗   ██╔══██╗  ╚██╗ ██╔╝\n'
    + '█████╗    ███████║  ██║         ██║     ██║   ██║   ██████╔╝   ╚████╔╝ \n'
    + '██╔══╝    ██╔══██║  ██║         ██║     ██║   ██║   ██╔══██╗    ╚██╔╝  \n'
    + '██║       ██║  ██║  ╚██████╗    ██║     ╚██████╔╝   ██║  ██║     ██║   \n'
    + '╚═╝       ╚═╝  ╚═╝   ╚═════╝    ╚═╝      ╚═════╝    ╚═╝  ╚═╝     ╚═╝   \n'
    + `${Colors.Reset}\n`)
}

export async function checkIfCanUpdate (packageName: string) {
  return execSync(`npm view ${packageName} version`).toString().trim();
}

export function isUsingYarn () {
  return (process.env.npm_config_user_agent || '').indexOf('yarn') === 0;
}

export function clearLastedLine () {
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)
}

export async function getPackage (projectName: string): Promise<any> {
  const location = join(process.cwd(), projectName, 'package.json')
  const jsonPackage = await fs.promises.readFile(location, 'utf-8')
  return JSON.parse(jsonPackage)
}

export function createEnvironment (params: { projectName: string, token: string }) {
  return {
    APP_TOKEN: params.token || 'Your token',
    PARTIALS: ['MESSAGE', 'CHANNEL', 'REACTION'],
    INTENTS: [
      'GUILDS',
      'GUILD_MEMBERS',
      'GUILD_BANS',
      'GUILD_EMOJIS_AND_STICKERS',
      'GUILD_INTEGRATIONS',
      'GUILD_WEBHOOKS',
      'GUILD_INVITES',
      'GUILD_VOICE_STATES',
      'GUILD_PRESENCES',
      'GUILD_MESSAGES',
      'GUILD_MESSAGE_REACTIONS',
      'GUILD_MESSAGE_TYPING',
      'DIRECT_MESSAGES',
      'DIRECT_MESSAGE_REACTIONS',
      'DIRECT_MESSAGE_TYPING',
    ],
  }
}