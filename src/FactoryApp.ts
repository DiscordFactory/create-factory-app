import { Command } from 'commander'
import CommandManager from './managers/CommandManager'
import CreateProject from './commands/CreateProject'
import Version from './commands/Version'

export default class FactoryApp {
  public application: Command | undefined
  public commandManager: CommandManager = new CommandManager()
  
  public async init () {
   await new CreateProject().run(),
   await new Version().run()

    this.commandManager.listen()
  }
}