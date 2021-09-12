import { Command, program } from 'commander'
import CreateProject from '../commands/CreateProject'
import Logger from '@leadcodedev/logger'

export default class CommandManager {
  constructor () {
    program
      .configureOutput({
        writeOut: (str) => Logger.send('info', str),
        writeErr: (str) => Logger.send('error', str),
        outputError: (str, write) => write(str.split(' ').slice(1).join(' '))
      })
      .showSuggestionAfterError()
  }

  public listen () {
    program.parse(process.argv)
  }
}