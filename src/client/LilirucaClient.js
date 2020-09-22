const { join } = require('path')
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo')
const Database = require('@database/Database')
const { LilirucaCommand } = require('@structures')
const { logger, locales } = require('@utils')
const { OWNER_IDS, DEFAULT_PREFIX, PLACES_ALIASES, PLACES, CATEGORIES } = require('@constants')

const joinPath = path => join(__dirname, '..', path)

class LilirucaClient extends AkairoClient {
  constructor () {
    super(
      {
        ownerID: OWNER_IDS
      }, {
        disableMentions: 'everyone',
        messageCacheMaxSize: 100
      }
    )

    const getPrefix = async ({ guild }) => {
      const guildData = guild && await this.db.guilds.get(guild.id)
      const prefix = guildData && guildData.prefix
      return prefix || DEFAULT_PREFIX
    }

    const commandOptions = {
      classToHandle: LilirucaCommand,
      directory: joinPath('commands'),
      prefix: getPrefix,
      automateCategories: true,
      allowMention: true,
      commandUtil: true,
      handleEdits: true,
      blockBots: true
    }

    const listenerOptions = {
      directory: joinPath('listeners')
    }

    this.db = Database
    this.logger = logger
    this.locales = locales
    this.commandHandler = new CommandHandler(this, commandOptions)
    this.listenerHandler = new ListenerHandler(this, listenerOptions)
  }

  loadCustomArgumentTypes () {
    this.commandHandler.resolver.addType('place', (message, phrase) => {
      if (!phrase) {
        return null
      }

      const resolved = phrase.toLowerCase()
      for (const place of PLACES) {
        if (PLACES_ALIASES[place].includes(resolved)) {
          return place
        }
      }

      return null
    })

    this.commandHandler.resolver.addType('realMember', (message, phrase) => {
      if (!phrase) {
        return null
      }

      const memberType = this.commandHandler.resolver.type('member')
      const member = memberType(message, phrase)
      if (member && !member.user.bot) {
        return member
      }

      return null
    })
  }

  async init () {
    await this.db.connect()
    await this.locales.loadAll()

    this.loadCustomArgumentTypes()
    this.commandHandler.useListenerHandler(this.listenerHandler)

    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()

    return this
  }

  async login (token = process.env.DISCORD_TOKEN) {
    await this.init()
    return super.login(token)
  }

  get commands () {
    return this.commandHandler.modules
  }

  get categories () {
    return this.commandHandler.categories.sort((a, b) => CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b))
  }
}

module.exports = LilirucaClient
