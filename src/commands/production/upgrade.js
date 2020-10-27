const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { removeItem } = require('@utils/items')
const { PLACES, UPGRADE_PRICE, UPGRADE_MATERIALS, PLACE_MAX_LEVEL, EMOJIS: { gear } } = require('@constants')

class Upgrade extends LilirucaCommand {
  constructor () {
    super('upgrade', {
      aliases: ['up'],
      emoji: gear,
      editable: true,
      args: [
        {
          id: 'place',
          type: 'place',
          otherwise: message => message.t('errors:noPlace')
        }
      ]
    })
  }

  async exec ({ ct, t, util, db, author }, { place }) {
    const data = await db.users.get(author.id)
    const dataPlace = data[place]

    if (!dataPlace.level) {
      return util.send(t('errors:locked'))
    }

    if (dataPlace.level === PLACE_MAX_LEVEL) {
      return util.send(ct('maxLevel'))
    }

    const price = UPGRADE_PRICE[place] * dataPlace.level

    if (data.money < price) {
      const missing = price - data.money
      return util.send(ct('noMoney', { missing }))
    }

    const { material, amount } = UPGRADE_MATERIALS[place]
    const required = amount * dataPlace.level
    const items = data.items[material] || 0

    if (items < required) {
      return util.send(ct('noMaterial', { material: t(`items:${material}`), missing: required - items }))
    }

    data[place].level++

    const last = PLACES[PLACES.length - 1]
    const unlocked = (place !== last && dataPlace.level === 10) && PLACES[PLACES.indexOf(place) + 1]

    const embed = unlocked && new LilirucaEmbed()
      .setDescription(`${author}, ${ct(`unlock.${unlocked}`)}`)

    removeItem(data, 'items', material, required)

    if (unlocked) {
      data[unlocked].level = 1
    }

    const values = {
      money: data.money - price
    }

    db.users.update(data, values)

    util.send(ct('success', { level: dataPlace.level }), embed)
  }
}

module.exports = Upgrade
