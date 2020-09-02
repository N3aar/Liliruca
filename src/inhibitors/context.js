const { Inhibitor } = require('discord-akairo')
const { DEFAULT_PREFIX, DEFAULT_LANGUAGE } = require('@constants')

class ContextInhibitor extends Inhibitor {
  constructor () {
    super('contenxt', {
      priority: 1
    })
  }

  async exec (message, command) {
    if (!command) return

    const guildData = await this.client.db.guilds.get(message.guild.id)
    const language = guildData.language || DEFAULT_LANGUAGE
    const t = this.client.locales.getT(language)
    // Context
    message.guildData = guildData
    message.t = t
    message.ct = (tPath, tOptions) => t(`commands:${command.id}.${tPath}`, tOptions)
    message.language = language
    message.locales = this.client.locales
    message.db = this.client.db
    message.prefix = guildData.prefix || DEFAULT_PREFIX
  }
}

module.exports = ContextInhibitor
