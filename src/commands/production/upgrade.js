const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { PLACES, PLACE_NAMES, UPGRADE_PRICE, PLACE_MAX_LEVEL, EMOJIS: { gear } } = require('@constants')

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

  async exec ({ ct, t, util, db, author, channel }, { place }) {
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
      const remainder = price - data.money
      return util.send(ct('noMoney', { remainder }))
    }

    data[place].level++

    const values = {
      money: data.money - price
    }

    await util.send(ct('success', { level: dataPlace.level }))

    this.checkUnlocked({ ct, author, data, place, channel })

    db.users.sets(data, values)
  }

  checkUnlocked ({ ct, author, data, place, channel }) {
    const dataPlace = data[place]

    if (place !== PLACE_NAMES.MINING && dataPlace.level === 10) {
      const index = PLACES.indexOf(place)
      const unlocked = PLACES[index + 1]

      const unlock = new LilirucaEmbed()
        .setDescription(`${author}, ${ct(`unlock.${unlocked}`)}`)

      data[unlocked].level = 1

      channel.send(unlock)
    }
  }
}

module.exports = Upgrade
