const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration } = require('@utils/date')
const { calculateProduction, bold } = require('@utils/util')
const { STORAGES_SIZE, PLACE_GENERATE, PLACES, EMOJIS } = require('@constants')

class Collect extends LilirucaCommand {
  constructor () {
    super('collect', {
      aliases: ['ct'],
      emoji: EMOJIS.produced,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  async exec ({ t, ct, util, language, db, author }) {
    const data = await db.users.get(author.id)

    const timestamp = Date.now()
    const oneHour = 3600000
    const collectedAt = data.collectedAt || timestamp - oneHour
    const past = timestamp - collectedAt

    if (past < oneHour) {
      const min = (60 - Math.floor(past / 60 / 1000)) || 1
      return util.send(ct('cooldown', { min }))
    }

    for (const place of PLACES) {
      const dataPlace = data[place]
      const storageLimit = (dataPlace.storage * STORAGES_SIZE[place])

      if (dataPlace.level && dataPlace.amount >= storageLimit) {
        return util.send(ct('full'))
      }
    }

    const places = PLACES.filter(place => data[place].level)

    const collect = places.map(place => {
      const dataPlace = data[place]
      const generate = dataPlace.level * PLACE_GENERATE[place]
      const production = calculateProduction(collectedAt, dataPlace.level, generate, place)

      data[place].amount += production

      const name = `\\${EMOJIS[place]} ${t(`commons:${place}`)}`
      const value = bold(`${t('commons:amount')}: ${production}`)

      return {
        name,
        value,
        inline: true
      }
    })

    const last = !data.collectedAt ? ct('first') : ct('last', { time: parseDuration(past, language) })
    const embed = new LilirucaEmbed()
      .addFields(collect)
      .setFooter(last)

    const values = {
      collectedAt: timestamp
    }

    db.users.update(data, values)

    util.send(ct('success'), embed)
  }
}

module.exports = Collect
