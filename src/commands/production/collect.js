const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration } = require('@utils/date')
const { calculateProduction, random } = require('@utils/util')
const { getToolInInventory, removeItem } = require('@utils/items')
const { STORAGES_SIZE, PLACE_GENERATE, PLACES, PLACES_BOOSTERS } = require('@constants/constant')
const emojis = require('@constants/emojis')

class Collect extends LilirucaCommand {
  constructor () {
    super('collect', {
      aliases: ['ct'],
      emoji: emojis.produced,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  async exec ({ t, ct, util, language, db, author }) {
    const data = await db.users.ensure(author.id)

    const timestamp = Date.now()
    const oneHour = 3600000
    const collectedAt = data.collectedAt || timestamp - oneHour
    const past = timestamp - collectedAt
    const last = !data.collectedAt ? ct('first') : ct('last', { time: parseDuration(past, language) })

    if (past < oneHour) {
      const min = (60 - Math.floor(past / 60 / 1000)) || 1
      return util.send(ct('cooldown', { min }))
    }

    for (const place of PLACES) {
      const dataPlace = data[place]
      const storageLimit = dataPlace.storage * STORAGES_SIZE[place]

      if (dataPlace.level && dataPlace.amount >= storageLimit) {
        return util.send(ct('full'))
      }
    }

    const places = PLACES.filter(place => data[place].level)
    const attack = data.farm.level >= 6 && this.farmAttack(data.items)

    if (!data.collectedAt) {
      data.collectedAt = collectedAt
    }

    const collect = places.map(place => {
      const dataPlace = data[place]
      const generate = dataPlace.level * PLACE_GENERATE[place]

      const name = PLACES_BOOSTERS[place]
      const booster = name && getToolInInventory(data, name)

      const { production, boosted } = calculateProduction(data, generate, place, booster)
      const limit = dataPlace.storage * STORAGES_SIZE[place]
      const total = dataPlace.amount + production > limit ? limit - dataPlace.amount : production
      const attacked = place === 'farm' && attack ? Math.floor(total - (total * (attack / 100))) : total
      const percentage = booster ? `\n${ct('boosted', { percentage: boosted })}` : ''

      if (booster) {
        removeItem(data, 'items', booster.id)
      }

      dataPlace.amount += attacked

      return {
        name: `\\${emojis[place]} ${t(`commons:${place}`)}`,
        value: `**${t('commons:amount')}: ${attacked.toLocaleString()}**` + percentage,
        inline: true
      }
    })

    const embed = new LilirucaEmbed()
      .addFields(collect)
      .setFooter(last)

    if (attack) {
      embed.setDescription(ct('attacked', { attack }))
    }

    if (data.items.scarecrow) {
      removeItem(data, 'items', 'scarecrow')
    }

    if (data.items.fence) {
      removeItem(data, 'items', 'fence')
    }

    const values = {
      collectedAt: timestamp
    }

    db.users.update(data, values)

    util.send(`\\${emojis.produced} ${ct('success')}`, embed)
  }

  farmAttack (items) {
    if (items.scarecrow && items.fence) {
      return null
    }

    const protection = !items.scarecrow && !items.fence ? 2 : 4
    if (random(protection) === 0) {
      return random(30, 5, true)
    }
  }
}

module.exports = Collect
