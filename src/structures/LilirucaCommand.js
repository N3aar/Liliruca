const { Command } = require('discord-akairo')
const { DEFAULT_PREFIX, DEFAULT_LANGUAGE } = require('../Constants')

/**
 * @property {import('@LilirucaClient')} client
 */
class LilirucaCommand extends Command {
  /**
   * @param {string} id command id
   * @param {import('discord-akairo').CommandOptions} options command options
   */
  constructor (id, options) {
    options.aliases = [...(options.aliases || []), id]
    super(id, options)

    this.channel = 'guild'
    this.emoji = options.emoji
    this.usage = !!options.args
  }

  async before (message) {
    const guildData = await this.client.db.guilds.get(message.guild.id)
    const language = guildData.language || DEFAULT_LANGUAGE
    const t = this.client.locales.getT(language)
    const ct = (tPath, tOptions) => t(`commands:${this.id}.${tPath}`, tOptions)

    message.guildData = guildData
    message.t = t
    message.ct = ct
    message.language = language
    message.locales = this.client.locales
    message.db = this.client.db
    message.prefix = guildData.prefix || DEFAULT_PREFIX

    return message
  }
}

module.exports = LilirucaCommand
