const Collection = require('@discordjs/collection')
const BaseHandler = require('../base/BaseHandler')
const LilirucaCommand = require('../LilirucaCommand')
const CommandUtil = require('./CommandUtil')
const SupportGuildUtil = require('../../utils/supportGuildUtil')
const { DEFAULT_PREFIX, DEFAULT_LANGUAGE, CATEGORIES } = require('../../utils/constants/constant')

const COMMAND_UTIL_LIFETIME = 1.2e+6
const COMMAND_UTIL_SWEEP_INTERVAL = 1.8e+6

class CommandHandler extends BaseHandler {
  constructor (client, directory, automateCategories = true) {
    super(client, {
      directory,
      classToHandle: LilirucaCommand,
      automateCategories
    })

    this.commandUtils = new Collection()
    this.aliases = new Collection()
    this.client.on('messageCreate', (message) => this.handle(message))
    this.client.on('messageUpdate', (message) => this.handle(message, true))
    this.client.on('messageDelete', (message) => this.onMessagesDelete([message]))
    this.client.on('messageDeleteBulk', (messages) => this.onMessagesDelete(messages))

    setInterval(() => {
      this.commandUtils.each((util, id) => {
        if ((Date.now() - util.createdAt) <= COMMAND_UTIL_LIFETIME) {
          this.commandUtils.delete(id)
        }
      })
    }, COMMAND_UTIL_SWEEP_INTERVAL)
  }

  onMessagesDelete (messages) {
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

  loadAll (...args) {
    super.loadAll(...args)
    this.argumentHandler.loadAll()
    this.categories = this.categories
      .filter(category => category !== 'dev')
      .sort((a, b) => CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b))
  }

  findCommand (str) {
    return this.modules.get(this.aliases.get(str))
  }

  getUsedPrefix (prefix, clientMention, content) {
    return [
      prefix?.toLowerCase() ?? DEFAULT_PREFIX,
      ...clientMention.map(m => m + ' ')
    ].find(p => content.startsWith(p))
  }

  async handle (message, editing) {
    if (this.isInvalidMessage(message)) {
      return
    }

    const clientMention = [`<@!${this.client.user.id}>`, `<@${this.client.user.id}>`]
    const guildData = await this.client.db.guilds.ensure(message.guildID)
    const language = guildData.language || DEFAULT_LANGUAGE
    const t = this.client.locales.getT(language)
    const prefix = this.getUsedPrefix(guildData.prefix, clientMention, message.content)

    if (!prefix) {
      return
    } else if (clientMention.some(p => message.content === p)) {
      const author = `**${message.author.username}**`
      return message.channel.createMessage(t('commons:botMention', { prefix, author }))
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()
    const command = this.findCommand(cmd)

    if (!command || (editing && !command.editable)) {
      return
    }

    if (this.commandUtils.has(message.id)) {
      message.util = this.commandUtils.get(message.id)
    } else {
      message.util = new CommandUtil(this.client, message.id, message.channel.id)
      if (command.editable) {
        this.commandUtils.set(message.id, message.util)
      }
    }

    if (command.ownerOnly && !this.client.owners.includes(message.author.id)) {
      return message.util.send('Este comando é disponível apenas para desenvolvedores.')
    }

    const missingPerms = this.runPermissionChecks(message, command)
    if (missingPerms) {
      const permissions = missingPerms.missing.map(perm => t(`permissions:${perm}`)).join(', ')
      return message.util.send(t(`permissions:${missingPerms.type}`, { permissions }))
    }

    message.guild = this.client.guilds.get(message.guildID)
    message.guildData = guildData
    message.t = t
    message.ct = this.client.locales.getCt(t, command)
    message.language = language
    message.locales = this.client.locales
    message.db = this.client.db
    message.prefix = prefix
    message.client = this.client

    try {
      command.exec(message)
    } catch (e) {
      SupportGuildUtil.errorChannel(this.client, message.guild, message.content, e.stack)
    }
  }

  runPermissionChecks (message, command) {
    const users = {
      client: this.client.user.id,
      user: message.author.id
    }

    for (const type in users) {
      const required = command[`${type}Permissions`]

      if (required) {
        const permissions = message.channel.permissionsOf(users[type])
        const parsed = Array.isArray(required) ? required : [required]
        const missing = parsed.filter(perm => !permissions.has(perm))

        if (missing.length) {
          return { type, missing }
        }
      }
    }

    return false
  }

  isInvalidMessage (message) {
    return message.author.bot ||
      !message.guildID ||
      !message.channel.permissionsOf(this.client.user.id).has('sendMessages')
  }
}

module.exports = CommandHandler
