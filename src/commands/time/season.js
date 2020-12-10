const LilirucaEmbed = require('@structures/LilirucaEmbed')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { getSeasonByMonth } = require('@utils/util')
const { SEASONS_COLORS } = require('@constants/constant')
const emojis = require('@constants/emojis')

class Season extends LilirucaCommand {
  constructor () {
    super('season', {
      aliases: ['sn'],
      emoji: emojis.cloud,
      clientPermissions: 'embedLinks'
    })
  }

  exec ({ t, ct, util }) {
    const month = new Date().getMonth() + 1

    const season = getSeasonByMonth(month)
    const seasonNext = getSeasonByMonth(month + 1)

    const seasonName = t(`commons:seasons.${season}`)
    const seasonNextName = t(`commons:seasons.${seasonNext}`)

    const seasons = [
      {
        name: ct('current'),
        value: `**${emojis[season]} ${seasonName}**`,
        inline: true
      },
      {
        name: ct('next'),
        value: `**${emojis[seasonNext]} ${seasonNextName}**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .setColor(SEASONS_COLORS[season])
      .addFields(seasons)

    util.send(`\\${emojis.cloud} ${ct('success')}`, embed)
  }
}

module.exports = Season
