const LilirucaCommand = require('@structures/LilirucaCommand')
const LIlirucaEmbed = require('@structures/LilirucaEmbed')
const { getSeasonByMonth } = require('@utils/util')
const { PLACES, SEASONS_PERCENTAGE, SEQUENCE_OF_SESSIONS, EMOJIS } = require('@constants')

const bold = string => `**${string}**`

class Months extends LilirucaCommand {
  constructor () {
    super('months', {
      aliases: ['mh'],
      emoji: EMOJIS.month,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  exec ({ ct, t, util }) {
    const places = {
      farm: t('commons:farm'),
      fishing: t('commons:fishing'),
      mining: t('commons:mining')
    }

    const seasonsInfos = SEQUENCE_OF_SESSIONS.map(season => {
      const emoji = EMOJIS[season]
      const seasonName = t(`commons:seasons.${season}`)

      const info = PLACES.map(place => {
        const percentage = SEASONS_PERCENTAGE[season][place]
        const effect = percentage >= 1 ? 'increase' : 'decrease'
        const value = Math.round(Math.abs(percentage - 1) * 100)

        const placeName = places[place]
        const effectInfo = ct(effect, { value })

        return bold(`${placeName} ${effectInfo}`)
      })

      const name = bold(`${emoji} » ${seasonName}`)
      const value = info.join('\n')

      return { name, value }
    })

    const emoji = EMOJIS.month
    const months = t('commons:date.months')
    const name = `\\${emoji} » ${months}`
    const value = bold(ct('duration'))

    seasonsInfos.unshift({ name, value })

    const currentMonth = new Date().getMonth() + 1
    const season = getSeasonByMonth(currentMonth)
    const current = t('commons:seasons.current')
    const seasonName = t(`commons:seasons.${season}`)
    const currentSeason = `${current}: ${seasonName}`

    const embed = new LIlirucaEmbed()
      .addFields(seasonsInfos)
      .setFooter(currentSeason)

    util.send(ct('success'), embed)
  }
}

module.exports = Months
