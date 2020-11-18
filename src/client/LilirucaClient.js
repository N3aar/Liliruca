const { readdirSync } = require('fs')
const { registerFont } = require('canvas')
const Database = require('@database/Database')
const { logger, locales } = require('@utils')
const { Client, Constants } = require('eris')
const CommandHandler = require('../structures/CommandHandler')

class LilirucaClient extends Client {
  constructor () {
    super(process.env.DISCORD_TOKEN, {
      allowedMentions: {
        everyone: false
      },
      messageLimit: 10,
      defaultImageSize: 2048,
      intents: [
        Constants.Intents.guilds,
        Constants.Intents.guildMessages
      ]
    }
    )

    this.eventCount = 0
    this.db = Database
    this.logger = logger
    this.locales = locales

    this.commandHandler = new CommandHandler(this, 'src/commands', true)
  }

  loadAllFonts () {
    const folder = 'src/assets/fonts/'
    const fonts = readdirSync(folder)

    for (const font of fonts) {
      const family = font.split('.')[0]
      registerFont(folder + font, { family })
    }
  }

  // loadCategories () {
  //   this.categories = this.commandHandler.categories
  //     .filter(category => category.id !== 'dev')
  //     .sorted((a, b) => CATEGORIES.indexOf(a.id) - CATEGORIES.indexOf(b.id))
  // }

  async init () {
    this.commandHandler.loadAll()
    await this.db.connect()
    await this.locales.loadAll()
    this.loadAllFonts()
    return this
  }

  // async permissionHandler ({ guild, channel }, command, type, missing) {
  //   const guildData = await Database.guilds.get(guild.id)
  //   const language = guildData.language || DEFAULT_LANGUAGE
  //   const t = locales.getT(language)

  //   const permissions = missing.map(perm => t(`permissions:${perm}`)).join(', ')

  //   channel.send(t(`permissions:${type}`, { permissions }))
  // }

  async login () {
    await this.init()
    return this.connect()
  }
}

module.exports = LilirucaClient
