const LilirucaEmbed = require('@structures/LilirucaEmbed')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { getSeasonByMonth } = require('@utils/util')
const { EMOJIS, SEASONS_COLORS } = require('@constants')

class Season extends LilirucaCommand {
  constructor () {
    super('season', {
      aliases: ['sn'],
      emoji: EMOJIS.cloud,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
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
        value: `**${EMOJIS[season]} ${seasonName}**`,
        inline: true
      },
      {
        name: ct('next'),
        value: `**${EMOJIS[seasonNext]} ${seasonNextName}**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .setColor(SEASONS_COLORS[season])
      .addFields(seasons)

    util.send(`\\☁️ ${ct('success')}`, embed)
  }
}

module.exports = Season
