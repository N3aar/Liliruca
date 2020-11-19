const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getWeatherByDay } = require('@utils/util')
const { WEATHERS_COLORS } = require('@constants/constant')
const emojis = require('@constants/emojis')

class Weather extends LilirucaCommand {
  constructor () {
    super('weather', {
      aliases: ['wr'],
      emoji: emojis.umbrella,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  exec ({ t, ct, util }) {
    const date = new Date()
    const day = date.getDate()

    date.setDate(day + 1)

    const weather = getWeatherByDay(day)
    const weatherNext = getWeatherByDay(date.getDate(), date.getMonth() + 2, date.getFullYear())

    const weatherName = t(`commons:weathers.${weather}`)
    const weatherNextName = t(`commons:weathers.${weatherNext}`)

    const seasons = [
      {
        name: ct('current'),
        value: `**${emojis[weather]} ${weatherName}**`,
        inline: true
      },
      {
        name: ct('next'),
        value: `**${emojis[weatherNext]} ${weatherNextName}**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .setColor(WEATHERS_COLORS[weather])
      .addFields(seasons)

    util.send(`\\${emojis.umbrella} ${ct('success')}`, embed)
  }
}

module.exports = Weather
