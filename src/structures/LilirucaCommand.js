const { Command } = require('discord-akairo')
const logger = require('@utils/logger')
const locales = require('@utils/locales')
/**
 * @property {import('@LilirucaClient')} client
 */
class LilirucaCommand extends Command {
  /**
   * @param {string} id ID do Comando
   * @param {import('discord-akairo').CommandOptions} options Opções de Comando
   */
  constructor (id, options) {
    options.aliases = [...(options.aliases || []), id]

    if (!options.emoji) {
      throw new Error(`${id} command: Emoji não foi definido.`)
    }

    super(id, options)

    this.emoji = options.emoji
    this.logger = logger.scope(this.constructor.name)

    if (locales.exists(`commands:${id}.description`)) {
      this.description = `commands:${id}.description`
    } else {
      this.logger.warn('not found description.')
    }

    if (this.args) {
      if (locales.exists(`commands:${id}.usage`)) {
        this.usage = `commands:${id}.usage`
      } else {
        this.logger.warn('not found usage.')
      }
    }
  }
}

module.exports = LilirucaCommand
