const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { getStoragePrice } = require('@utils/util')
const { EMOJIS, STORAGE_PRICES } = require('@constants')

class Storage extends LilirucaCommand {
  constructor () {
    super('storage', {
      emoji: EMOJIS.storage,
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
      const locked = t('errors:locked')
      return util.send(locked)
    }

    const storage = STORAGE_PRICES[place]
    const level = dataPlace.storage
    const price = getStoragePrice(storage, level, level + levels)

    if (data.money < price) {
      const remainder = price - data.money
      const noMoney = ct('noMoney', { remainder })
      return util.send(noMoney)
    }

    data[place].storage += levels

    const values = {
      money: data.money -= price
    }

    db.users.sets(data, values)

    util.send(ct('success', { level: dataPlace.storage }))
  }
}

module.exports = Storage
