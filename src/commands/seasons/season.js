const { MessageEmbed } = require('discord.js')
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

    const current = ct('current')
    const next = ct('next')

    const seasonEmoji = EMOJIS[season]
    const seasonNextEmoji = EMOJIS[seasonNext]

    const seasonName = t(`commons:seasons.${season}`)
    const seasonNextName = t(`commons:seasons.${seasonNext}`)

    const color = SEASONS_COLORS[season]
    const embed = new MessageEmbed()
      .setColor(color)
      .addField(current, `${seasonEmoji} ${seasonName}`)
      .addField(next, `${seasonNextEmoji} ${seasonNextName}`)

    util.send(embed)
  }
}

module.exports = Season
