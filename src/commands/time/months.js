const LilirucaCommand = require('@structures/LilirucaCommand')
const LIlirucaEmbed = require('@structures/LilirucaEmbed')
const { getSeasonByMonth } = require('@utils/util')
const { PLACES, SEASONS_PERCENTAGE, SEASONS, EMOJIS } = require('@constants')

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

    const fields = SEASONS.map(season => {
      const seasonName = t(`commons:seasons.${season}`)

      const info = PLACES.map(place => {
        const percentage = SEASONS_PERCENTAGE[season][place]
        const value = Math.round(Math.abs(percentage - 1) * 100)
        const effectInfo = ct(percentage >= 1 ? 'increase' : 'decrease', { value })

        return `**${places[place]} ${effectInfo}**`
      })

      return {
        name: `**${EMOJIS[season]} » ${seasonName}**`,
        value: info.join('\n')
      }
    })

    fields.unshift({
      name: `\\${EMOJIS.month} » ${t('commons:date.months')}`,
      value: ct('duration')
    })

    const season = getSeasonByMonth()
    const emoji = EMOJIS[season]
    const seasonName = t(`commons:seasons.${season}`)
    const current = ct('current', { emoji, season: seasonName })

    const embed = new LIlirucaEmbed()
      .addFields(fields)
      .setFooter(current)

    util.send(ct('success'), embed)
  }
}

module.exports = Months
