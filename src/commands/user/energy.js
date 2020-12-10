const LilirucaCommand = require('@structures/LilirucaCommand')
const { parseDuration } = require('@utils/date')
const { ENERGY_COOLDOWN } = require('@constants/constant')
const { battery } = require('@constants/emojis')

class Energy extends LilirucaCommand {
  constructor () {
    super('energy', {
      aliases: ['eg'],
      emoji: battery
    })
  }

  async exec ({ ct, author, language, db, util }) {
    const data = await db.users.ensure(author.id)
    const timestamp = data.energizedAt ? Date.now() - data.energizedAt : ENERGY_COOLDOWN

    if (timestamp < ENERGY_COOLDOWN) {
      const remaining = ENERGY_COOLDOWN - timestamp
      const time = parseDuration(remaining, language)
      return util.send(ct('cooldown', { time }))
    }

    const values = {
      energizedAt: Date.now(),
      energy: 100
    }

    db.users.update(data, values)

    util.send(`\\⚡ ${ct('success')}`)
  }
}

module.exports = Energy
