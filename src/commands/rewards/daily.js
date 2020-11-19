const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration } = require('@utils/date')
const { DAILY_COOLDOWN, DAILY_REWARD, DAILY_BONUS, DAILY_STREAK, EMOJIS: { star, glowingstar, gift } } = require('@constants')

class Daily extends LilirucaCommand {
  constructor () {
    super('daily', {
      aliases: ['dl'],
      emoji: star,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  async exec ({ ct, t, db, language, author, util }) {
    const data = await db.users.ensure(author.id)
    const timestamp = data.dailyAt ? Date.now() - data.dailyAt : DAILY_COOLDOWN

    if (timestamp < DAILY_COOLDOWN) {
      const remaining = DAILY_COOLDOWN - timestamp
      const time = parseDuration(remaining, language)
      return util.send(ct('cooldown', { time }))
    }

    const broke = timestamp >= (DAILY_COOLDOWN * 2)
    const streak = broke || data.dailyStreak >= 5 ? 1 : data.dailyStreak + 1
    const reward = streak < 5 ? DAILY_REWARD : DAILY_BONUS
    const days = 5 - streak

    const values = {
      dailyAt: Date.now(),
      dailyStreak: streak,
      lilistars: data.lilistars + reward
    }

    db.users.update(data, values)

    const fields = [
      {
        name: `\\${gift} ${t('commons:reward')}`,
        value: `**+${reward} Lilistars**`,
        inline: true
      },
      {
        name: `\\${glowingstar} ${t('commons:bonus')}`,
        value: days ? ct('remaining', { days }) : ct('bonus'),
        inline: true
      }
    ]

    const defaultUrl = 'https://cdn.discordapp.com/attachments/612335526019596289/'
    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setImage(defaultUrl + DAILY_STREAK[streak - 1])

    if (broke) {
      embed.setFooter(ct('broke'))
    }

    util.send(`\\${star} ${ct('success')}`, embed)
  }
}

module.exports = Daily
