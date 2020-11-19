const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { getStoragePrice } = require('@utils/util')
const { getItemName, removeItem } = require('@utils/items')
const { STORAGE_PRICES, UPGRADE_MATERIALS } = require('@constants/constant')
const { storage } = require('@constants/emojis')

class Storage extends LilirucaCommand {
  constructor () {
    super('storage', {
      aliases: ['sg'],
      emoji: storage,
      editable: true,
      args: [
        {
          id: 'place',
          type: 'place',
          otherwise: message => message.t('errors:noPlace')
        },
        {
          id: 'levels',
          type: Argument.range('integer', 1, 1000000),
          default: 1
        }
      ]
    })
  }

  async exec ({ ct, t, util, db, author }, { place, levels }) {
    const data = await db.users.get(author.id)
    const dataPlace = data[place]

    if (!dataPlace.level) {
      return util.send(t('errors:locked'))
    }

    const level = dataPlace.storage
    const upgrade = level + levels

    const storagePrice = STORAGE_PRICES[place]
    const price = getStoragePrice(storagePrice, level, upgrade)

    if (data.money < price) {
      const missing = price - data.money
      return util.send(ct('noMoney', { missing }))
    }

    const { material, amount } = UPGRADE_MATERIALS[place]
    const items = data.items[material] || 0
    const required = Math.floor(amount / UPGRADE_MATERIALS.storage)
    const materials = getStoragePrice(required, level, upgrade)

    if (items < materials) {
      const missing = materials - items
      return util.send(ct('noMaterials', { missing, material: getItemName(material, t) }))
    }

    removeItem(data, 'items', material, materials)

    data[place].storage += levels

    const values = {
      money: data.money - price
    }

    db.users.update(data, values)

    util.send(`\\${storage} ${ct('success', { level: dataPlace.storage })}`)
  }
}

module.exports = Storage
