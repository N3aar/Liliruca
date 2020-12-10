/* eslint-disable no-eval */
const { inspect } = require('util')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const SupportGuildUtil = require('@utils/supportGuildUtil')
const { EMBED_COLORS } = require('@constants/constant')
const { wrench } = require('@constants/emojis')

const codeBlock = (code, language) => `\`\`\`${language}\n${code}\n\`\`\``

class Eval extends LilirucaCommand {
  constructor () {
    super('eval', {
      emoji: wrench,
      ownerOnly: true,
      clientPermissions: 'embedLinks',
      args: [
        {
          id: 'code',
          type: 'string',
          match: 'rest',
          otherwise: 'Digite um código a ser executado!'
        }
      ]
    })
  }

  async exec ({ client, channel, content, author, mentions, util, guild, db, prefix, t, ct }, { code }) {
    const embed = new LilirucaEmbed()
    const text = code.replace(/^`(``(js|javascript)?\s?)?|`(``)?$/g, '')

    SupportGuildUtil.evalIntegration(client, author, guild.name, codeBlock(code))

    try {
      const evald = await eval(text)
      const toEval = inspect(evald, { depth: 0 }).substring(0, 2000)
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
