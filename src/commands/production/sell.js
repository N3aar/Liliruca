const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getPriceResource } = require('@utils/util')
const { PLACES, PLACES_RESOURCES } = require('@constants/constant')
const emojis = require('@constants/emojis')

class Sell extends LilirucaCommand {
  constructor () {
    super('sell', {
      aliases: ['sl'],
      emoji: emojis.money,
      clientPermissions: 'embedLinks'
    })
  }

  async exec ({ ct, t, util, db, author }) {
    const data = await db.users.ensure(author.id)
    const places = PLACES.filter(place => data[place].level >= 1 && data[place].amount >= 10)

    if (!places.length) {
      return util.send(ct('noStorage'))
    }

    let total = 0

    const sell = places.map(place => {
      const dataPlace = data[place]
      const resource = PLACES_RESOURCES[place]

      const price = getPriceResource(resource, dataPlace.amount)

      data[place].amount = 0
      total += price

      const name = `\\${emojis[place]} ${t(`commons:${place}`)}`
      const value = `**${t('commons:price')}: $${price.toLocaleString()}**`

      return {
        name,
        value,
        inline: true
      }
    })

    const current = data.money + total
    const embed = new LilirucaEmbed()
      .addFields(sell)
      .setFooter(`Total: $${total.toLocaleString()} / ${t('commons:current')}: $${current.toLocaleString()}`)

    const values = {
      money: current
    }

    db.users.update(data, values)

    util.send(`\\${emojis.money} ${ct('success')}`, embed)
  }
}

module.exports = Sell
