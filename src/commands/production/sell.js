const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getPriceResource } = require('@utils/util')
const { PLACES, PLACES_RESOURCES, EMOJIS } = require('@constants')

const bold = string => `**${string}**`

class Sell extends LilirucaCommand {
  constructor () {
    super('sell', {
      aliases: ['sl'],
      emoji: EMOJIS.money,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  async exec ({ ct, t, util, db, author }) {
    const data = await db.users.get(author.id)
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

      const name = `\\${EMOJIS[place]} ${t(`commons:${place}`)}`
      const value = bold(`${t('commons:price')}: $${price}`)

      return {
        name,
        value,
        inline: true
      }
    })

    const current = data.money + total
    const embed = new LilirucaEmbed()
      .addFields(sell)
      .setFooter(`Total: $${total} / ${t('commons:current')}: $${current}`)

    const values = {
      money: current
    }

    db.users.update(data, values)

    util.send(ct('success'), embed)
  }
}

module.exports = Sell
