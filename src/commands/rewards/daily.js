const LilirucaCommand = require('@structures/LilirucaCommand')
const { parseDuration } = require('@utils/date')
const { DAILY_COOLDOWN, EMOJIS: { star } } = require('@constants')

class Daily extends LilirucaCommand {
  constructor () {
    super('daily', {
      aliases: ['dl'],
      emoji: star,
      editable: true
    })
  }

  async exec ({ db, language, ct, author, util }) {
    const data = await db.users.get(author.id)
    const timestamp = Date.now() - data.dailyAt || 0

    if (timestamp < DAILY_COOLDOWN && data.dailyAt) {
      const remaining = DAILY_COOLDOWN - timestamp
      const time = parseDuration(remaining, language)
      return util.send(ct('cooldown', { time }))
    }

    const values = {
      dailyAt: Date.now(),
      lilistars: data.lilistars + 10
    }

    db.users.update(data, values)

    util.send(ct('success', { count: 10 }))
  }
}

module.exports = Daily
