const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItemById, removeItem } = require('@utils/items')
const { EMOJIS: { shopcart, pack, money } } = require('@constants')

class Sale extends LilirucaCommand {
  constructor () {
    super('sale', {
      aliases: ['se'],
      emoji: shopcart,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'itemId',
          type: 'itemId',
          otherwise: message => message.t('errors:noItem')
        },
        {
          id: 'amount',
          type: Argument.range('integer', 1, Infinity),
          default: 1
        }
      ]
    })
  }

  async exec ({ t, ct, util, db, author }, { itemId, amount }) {
    const data = await db.users.get(author.id)
    const value = data.items[itemId]

    if (!value || value < amount) {
      return util.send(ct('noItems'))
    }

    const item = getItemById(itemId)
    const price = (item.sale || Math.floor(item.price / item.value / 3)) * amount
    const fields = [
      {
        name: `\\${pack} ${t('commons:item')}`,
        value: `**${item.emoji} ${amount}x ${getItemName(itemId, t)}**`,
        inline: true
      },
      {
        name: `${money} ${t('commons:price')}`,
        value: `**${ct(item.payment, { value: price })}**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(fields)

    removeItem(data, 'items', itemId, amount)

    const values = {
      [item.payment]: data[item.payment] + price
    }

    db.users.update(data, values)

    util.send(`\\${shopcart} ${ct('success')}`, embed)
  }
}

module.exports = Sale
