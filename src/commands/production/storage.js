const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { getStoragePrice } = require('@utils/util')
const { STORAGE_PRICES, EMOJIS: { storage } } = require('@constants')

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

    const storage = STORAGE_PRICES[place]
    const level = dataPlace.storage
    const price = getStoragePrice(storage, level, level + levels)

    if (data.money < price) {
      const remainder = price - data.money
      return util.send(ct('noMoney', { remainder }))
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
