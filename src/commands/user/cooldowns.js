const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration } = require('@utils/date')
const { DAILY_COOLDOWN, ENERGY_COOLDOWN, GIVE_COOLDOWN } = require('@constants/constant')
const { clock, star, battery, produced, handshake } = require('@constants/emojis')

class Cooldowns extends LilirucaCommand {
  constructor () {
    super('cooldowns', {
      aliases: ['cd'],
      emoji: clock,
      clientPermissions: 'embedLinks'
    })
  }

  async exec ({ author, db, ct, language, util }) {
    const data = await db.users.ensure(author.id)
    const available = ct('available')

    const getCooldown = (cooldown, defaultCd) => {
      const past = Date.now() - cooldown

      if (!cooldown || past > defaultCd) {
        return available
      }

      const oneHour = 3600000
      const remaining = defaultCd - past

      const time = remaining > oneHour && ct('wait', { time: parseDuration(remaining, language) })

      return time || ct('min', { min: (Math.round(remaining / 60 / 1000)) || 1 })
    }

    const cooldowns = [
      {
        name: `\\${star} Daily`,
        value: `**${getCooldown(data.dailyAt, DAILY_COOLDOWN)}**`
      },
      {
        name: `\\${battery} Energy`,
        value: `**${getCooldown(data.energizedAt, ENERGY_COOLDOWN)}**`
      },
      {
        name: `\\${produced} Collect`,
        value: `**${getCooldown(data.collectedAt, 3600000)}**`
      },
      {
        name: `\\${handshake} Give`,
        value: `**${getCooldown(data.givedAt, GIVE_COOLDOWN)}**`
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(cooldowns)

    util.send(`\\${clock} ${ct('success')}`, embed)
  }
}

module.exports = Cooldowns
