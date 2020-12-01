const { readdirSync } = require('fs')
const { registerFont } = require('canvas')
const Database = require('@database/Database')
const { logger, locales } = require('@utils')
const { Client, Constants } = require('eris')
const CommandHandler = require('@structures/command/CommandHandler')
const ListenerHandler = require('@structures/ListenerHandler')

class LilirucaClient extends Client {
  constructor () {
    super(process.env.DISCORD_TOKEN, {
      allowedMentions: {
        everyone: false
      },
      maxShards: 'auto',
      messageLimit: 10,
      defaultImageSize: 2048,
      intents:
        Constants.Intents.guilds |
        Constants.Intents.guildMessages
    })

    this.owners = process.env.OWNER_IDS?.split(' ') ?? []
    this.eventCount = 0
    this.requestCount = 0
    this.db = Database
    this.logger = logger
    this.locales = locales

    this.commandHandler = new CommandHandler(this, 'src/commands', true)
    this.listenerHandler = new ListenerHandler(this, 'src/listeners', true)

    this.on('rawWS', () => this.eventCount++)
    this.on('rawREST', () => this.requestCount++)
  }

  loadAllFonts () {
    const folder = 'src/assets/fonts/'
    const fonts = readdirSync(folder)

    for (const font of fonts) {
      const family = font.split('.')[0]
      registerFont(folder + font, { family })
    }
  }

  async init () {
    await this.locales.loadAll()
    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()
    await this.db.connect()
    this.loadAllFonts()
    return this
  }

  async login () {
    await this.init()
    return this.connect()
  }
}

module.exports = LilirucaClient
