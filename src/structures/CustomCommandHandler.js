const { CommandHandler } = require('discord-akairo')
const { DEFAULT_PREFIX, DEFAULT_LANGUAGE } = require('../Constants')

class CustomCommandHandler extends CommandHandler {
  async handler (message) {
    return super.handler(await CustomCommandHandler.customizeMessage(message))
  }

  static async customizeMessage (message) {
    const guildData = await this.client.db.guilds.get(message.guild.id)
    const language = guildData.language || DEFAULT_LANGUAGE
    const t = this.client.locales.getT(language)
    message.guildData = guildData
    message.t = t
    message.language = language
    message.locales = this.client.locales
    message.db = this.client.db
    message.prefix = guildData.prefix || DEFAULT_PREFIX
    return message
  }
}

module.exports = CustomCommandHandler
