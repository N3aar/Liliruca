/* eslint-disable no-eval */
const { inspect } = require('util')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { EMBED_COLORS } = require('@constants/constant')
const { wrench } = require('@constants/emojis')

const codeBlock = (code, language) => `\`\`\`${language}\n${code}\n\`\`\``

class Eval extends LilirucaCommand {
  constructor () {
    super('eval', {
      emoji: wrench,
      editable: true,
      ownerOnly: true,
      clientPermissions: 'embedLinks',
      args: [
        {
          id: 'code',
          match: 'content',
          otherwise: 'Digite um código a ser executado!'
        }
      ]
    })
  }

  async exec ({ client, channel, content, author, mentions, util, guild, db, prefix, t, ct }, { code }) {
    const embed = new LilirucaEmbed()
    const text = code.replace(/^`(``(js|javascript)?\s?)?|`(``)?$/g, '')

    Eval.emitLog(author, guild, text)

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

  /*
  static emitLog (author, guild, code) {
    const webhook = new WebhookClient(process.env.WK_EVAL_ID, process.env.WK_EVAL_TOKEN)
    const embed = new LilirucaEmbed()
      .setAuthor(author.tag, author.dynamicAvatarURL('png', 4096))
      .setDescription(codeBlock(code))
      .setFooter(`${guild.name}`)

    webhook.send(embed)
  }
  */
}

module.exports = Eval
