const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { backgrounds, EMOJIS: { card } } = require('@constants')

class Backgrounds extends LilirucaCommand {
  constructor () {
    super('backgrounds', {
      aliases: ['bs'],
      emoji: card,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'id',
          type: Argument.range('integer', 1, backgrounds.length, true),
          default: 1
        }
      ]
    })
  }

  exec ({ ct, util }, { id }) {
    const defaultUrl = 'https://cdn.discordapp.com/attachments/612335526019596289/'
    const embed = new LilirucaEmbed()
      .setImage(defaultUrl + backgrounds[id - 1])

    util.send(`\\${card} ${ct('success', { id })}`, embed)
  }
}

module.exports = Backgrounds
