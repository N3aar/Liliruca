const Collection = require('@discordjs/collection')
const BaseHandler = require('./base/BaseHandler')
const LilirucaCommand = require('./LilirucaCommand')
const CommandUtil = require('./CommandUtil')

class CommandHandler extends BaseHandler {
  constructor (client, directory, automateCategories = true) {
    super(client, {
      directory,
      classToHandle: LilirucaCommand,
      automateCategories
    })

    // TODO: deleta o commandUtil dps de 10/20min do ultimo uso
    this.commandUtils = new Collection()
    this.aliases = new Collection()
    this.client.on('messageCreate', (message) => this.handle(message))
    this.client.on('messageUpdate', (message) => this.handle(message))
    this.client.on('messageDelete', (message) => this.onMessageDelete(message))
    this.client.on('messageDeleteBulk', (messages) => this.onMessageDelete(messages))
  }

  onMessageDelete (messages) {
    if (!Array.isArray(messages)) {
      return this.onMessageDelete([messages])
    }
    messages.forEach(message => {
      if (this.commandUtils.has(message.id)) {
        return this.commandUtils.delete(message.id)
      }
      this.commandUtils.each((util) => {
        if (util.sentMessageId === message.id) {
          util.sentMessageId = null
        }
      })
    })
  }

  register (command, filepath) {
    super.register(command, filepath)
    this.registerAlias(command.id, command.id)
    command.aliases.forEach(alias => this.registerAlias(alias, command.id))
  }

  registerAlias (alias, commandId) {
    const conflict = this.aliases.get(alias)
    if (conflict) {
      throw new Error(`Alias \`${alias}\` already registered to ${conflict}.`)
    }
    this.aliases.set(alias, commandId)
  }

  findCommand (str) {
    return this.modules.get(this.aliases.get(str))
  }

  async handle (message) {
    if (this.isInvalidMessage(message)) {
      return
    }
    // TEMPORARIO
    const prefix = '!'
    if (!message.content.toLowerCase().startsWith(prefix)) {
      return
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()
    const command = this.findCommand(cmd)

    if (!command) return

    const guildData = await this.client.db.guilds.get(message.guildID)
    const language = guildData.language || 'pt-br'
    const t = this.client.locales.getT(language)
    const ct = (tPath, tOptions) => t(`commands:${command.id}.${tPath}`, tOptions)

    if (this.commandUtils.has(message.id)) {
      message.util = this.commandUtils.get(message.id)
    } else {
      message.util = new CommandUtil(this.client, message.id, message.channel.id)
      this.commandUtils.set(message.id, message.util)
    }

    message.guildData = guildData
    message.t = t
    message.ct = ct
    message.language = language
    message.locales = this.client.locales
    message.db = this.client.db
    message.prefix = prefix
    message.client = this.client
    command.exec(message)
  }

  isInvalidMessage (message) {
    return message.author.bot ||
   message.channel.type !== 0
  }
}

module.exports = CommandHandler
