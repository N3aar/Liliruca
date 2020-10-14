const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getWeatherByDay } = require('@utils/util')
const { WEATHERS, WEATHER_PERCENTAGE, PLACES, EMOJIS } = require('@constants')

class Days extends LilirucaCommand {
  constructor () {
    super('days', {
      aliases: ['dy'],
      emoji: EMOJIS.cloudrain,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  exec ({ client, t, ct, util }) {
    const places = {
      farm: t('commons:farm'),
      fishing: t('commons:fishing'),
      mining: t('commons:mining')
    }

    const fields = WEATHERS.map(weather => {
      const weatherName = t(`commons:weathers.${weather}`)

      const info = PLACES.map(place => {
        const weathers = WEATHER_PERCENTAGE[weather]
        const percentage = weathers && weathers[place]

        const effect = percentage >= 1 ? 'increase' : 'decrease'
        const value = percentage && Math.round(Math.abs(percentage - 1) * 100)
        const effectInfo = value ? ct(effect, { value }) : ct('noEffect')

        return `**${places[place]} ${effectInfo}**`
      })

      return {
        name: `**${EMOJIS[weather]} » ${weatherName}**`,
        value: info.join('\n')
      }
    })

    const weather = getWeatherByDay()
    const emoji = EMOJIS[weather]
    const name = t(`commons:weathers.${weather}`)
    const current = ct('current', { emoji, weather: name })

    const embed = new LilirucaEmbed()
      .setDescription(ct('note'))
      .addFields(fields)
      .setFooter(current)

    util.send(ct('success'), embed)
  }
}

module.exports = Days
