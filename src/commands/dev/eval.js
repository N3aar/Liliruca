/* eslint-disable no-eval */
const { inspect } = require('util')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { EMOJIS, EMBED_COLORS } = require('@constants')

const codeBlock = (code, language) => `\`\`\`${language}\n${code}\n\`\`\``

class Eval extends LilirucaCommand {
  constructor () {
    super('eval', {
      emoji: EMOJIS.wrench,
      editable: true,
      ownerOnly: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'code',
          type: 'string',
          otherwise: 'Digite um código a ser executado!'
        }
      ]
    })
  }

  async exec ({ channel, content, author, mentions, util, guild, db, prefix, t, ct }, { code }) {
    const embed = new LilirucaEmbed()
    const text = code.replace(/^`(``(js|javascript)?\s?)?|`(``)?$/g, '')

    try {
      const evald = await eval(text)
      const toEval = inspect(evald, { depth: 0 })
      embed
        .setDescription(codeBlock(toEval, 'js'))
        .setColor(EMBED_COLORS.success)

      if (!toEval || !evald) {
        embed.setColor(EMBED_COLORS.error)
      }
    } catch (error) {
      embed
        .setDescription(codeBlock(error, 'js'))
        .setColor(EMBED_COLORS.error)

      console.error('eval: ', error)
    } finally {
      util.send(embed)
    }
  }
}

module.exports = Eval
