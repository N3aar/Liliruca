const { logger, locales } = require('../utils')
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo')
const { OWNER_IDS, DEFAULT_PREFIX } = require('@constants')
const { join } = require('path')
const Database = require('@database/Database')
const { LilirucaCommand } = require('@structures')

class LilirucaClient extends AkairoClient {
  constructor () {
    super({
      ownerID: OWNER_IDS
    }, {
      disableMentions: 'everyone',
      messageCacheMaxSize: 100
    })

    this.db = Database
    this.logger = logger
    this.locales = locales

    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      automateCategories: true,
      classToHandle: LilirucaCommand,
      commandUtil: true,
      handleEdits: true,
      prefix: async (message) => {
        const guildData = message.guild && await this.db.guilds.get(message.guild.id)
        return guildData ? guildData.prefix || DEFAULT_PREFIX : DEFAULT_PREFIX
      },
      argumentDefaults: {
        prompt: {
          retries: 0,
          timeout: (m) => m.t('commons:defaultTimeout'),
          ended: (m) => m.t('commons:defaultEnded'),
          cancel: (m) => m.t('commons:defaultCancel'),
          modifyRetry: (m, text) => `${m.author.toString()}, ${text}\n\n${m.t('commons:cancelMessage')}`,
          modifyStart: (m, text) => `${m.author.toString()}, ${text}\n\n${m.t('commons:cancelMessage')}`
        }
      }
    })

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'listeners')
    })

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: join(__dirname, '..', 'inhibitors')
    })
  }

  async init () {
    await this.locales.loadAll()
    await this.db.connect()

    this.addTypes()

    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler)

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      inhibitorHandler: this.inhibitorHandler
    })

    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()
    this.inhibitorHandler.loadAll()

    return this
  }

  async login (token) {
    await this.init()
    return super.login(token)
  }

  get commands () {
    return this.commandHandler.modules
  }

  addTypes () {
    this.commandHandler.resolver.addType('place', (m, phrase) => {
      if (!phrase) return null
      const resolved = phrase.toLowerCase()
      if (['farm', 'fm', 'fazenda'].includes(resolved)) return 'farm'
      if (['fishing', 'fs', 'pescaria'].includes(resolved)) return 'fishing'
      if (['mining', 'mn', 'mineradora'].includes(resolved)) return 'mining'
      return null
    })
  }

  get categories () {
    const order = [
      'production',
      'user',
      'rewards',
      'seasons',
      'ranking',
      'rpguild',
      'rpguild_admin',
      'administration',
      'others'
    ]

    return this.commandHandler.categories.sort((a, b) => order.indexOf(a) - order.indexOf(b))
  }
}

module.exports = LilirucaClient
