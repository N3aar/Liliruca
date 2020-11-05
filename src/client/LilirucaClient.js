const { join } = require('path')
const { readdirSync } = require('fs')
const { registerFont } = require('canvas')
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo')
const Database = require('@database/Database')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { logger, locales } = require('@utils')
const { hasItem } = require('@utils/items')
const { OWNER_IDS, DEFAULT_PREFIX, DEFAULT_LANGUAGE, PLACES_ALIASES, PLACES, CATEGORIES } = require('@constants')
const { Intents } = require('discord.js')
const joinPath = path => join(__dirname, '..', path)

class LilirucaClient extends AkairoClient {
  constructor () {
    super(
      {
        ownerID: OWNER_IDS
      }, {
        disableMentions: 'everyone',
        messageCacheMaxSize: 100,
        ws: {
          intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES
          ]
        }
      }
    )

    this.eventCount = 0

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

    const inhibitorOptions = {
      directory: joinPath('inhibitors')
    }

    this.commandHandler = new CommandHandler(this, commandOptions)
    this.listenerHandler = new ListenerHandler(this, listenerOptions)
    this.inhibitorHandler = new InhibitorHandler(this, inhibitorOptions)
    this.db = Database
    this.logger = logger
    this.locales = locales
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

    this.commandHandler.resolver.addType('itemId', (message, phrase) => {
      if (!phrase) {
        return null
      }

      const item = phrase.toLowerCase()
      if (hasItem(item)) {
        return item
      }

      return null
    })
  }

  loadAllFonts () {
    const folder = 'src/assets/fonts/'
    const fonts = readdirSync(folder)

    for (const font of fonts) {
      const family = font.split('.')[0]
      registerFont(folder + font, { family })
    }
  }

  loadCategories () {
    this.categories = this.commandHandler.categories
      .filter(category => category.id !== 'dev')
      .sorted((a, b) => CATEGORIES.indexOf(a.id) - CATEGORIES.indexOf(b.id))
  }

  async init () {
    await this.db.connect()
    await this.locales.loadAll()

    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler)

    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()
    this.inhibitorHandler.loadAll()

    this.loadCustomArgumentTypes()
    this.loadCategories()
    this.loadAllFonts()

    this.commandHandler.on('missingPermissions', this.permissionHandler)

    return this
  }

  async permissionHandler ({ guild, channel }, command, type, missing) {
    const guildData = await Database.guilds.get(guild.id)
    const language = guildData.language || DEFAULT_LANGUAGE
    const t = locales.getT(language)

    const permissions = missing.map(perm => t(`permissions:${perm}`)).join(', ')

    channel.send(t(`permissions:${type}`, { permissions }))
  }

  async login (token = process.env.DISCORD_TOKEN) {
    await this.init()
    return super.login(token)
  }

  get commands () {
    return this.commandHandler.modules
  }
}

module.exports = LilirucaClient
