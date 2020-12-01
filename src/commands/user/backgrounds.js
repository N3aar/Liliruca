const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const backgrounds = require('@constants/backgrounds')
const { card } = require('@constants/emojis')

class Backgrounds extends LilirucaCommand {
  constructor () {
    super('backgrounds', {
      aliases: ['bs'],
      emoji: card,
      clientPermissions: 'embedLinks',
      args: [
        {
          id: 'id',
          type: 'number',
          forceMin: 1,
          forceMax: backgrounds.length,
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
