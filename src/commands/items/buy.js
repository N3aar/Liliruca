const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemById, hasItem, addItemInInventory } = require('@utils/items')
const { EMOJIS: { shopcart, pack, money } } = require('@constants')

class Buy extends LilirucaCommand {
  constructor () {
    super('buy', {
      aliases: ['by'],
      emoji: shopcart,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'itemId',
          type: Argument.validate('lowercase', (message, phrase) => hasItem(phrase)),
          otherwise: message => message.ct('noItem')
        },
        {
          id: 'amount',
          type: Argument.range('integer', 1, 100),
          default: 1
        }
      ]
    })
  }

  async exec ({ ct, t, db, member, util }, { itemId, amount }) {
    const item = getItemById(itemId)
    const data = await db.users.get(member.id)

    if (item.required && data[item.place].level < item.required) {
      return util.send(t('errors:locked'))
    }

    if (data[item.payment] < (item.price * amount)) {
      return util.send(ct('noMoney'))
    }

    const inventory = data.activeItems[itemId] ? 'activeItems' : 'items'

    addItemInInventory(data[inventory], itemId, item.value * amount)
    data.markModified(inventory)

    const price = item.price * amount
    const values = {
      [item.payment]: data[item.payment] - price
    }

    db.users.update(data, values)

    const buy = [
      {
        name: `\\${pack} ${t('commons:item')}`,
        value: `**${item.emoji} ${amount}x ${t(`items:${itemId.replace(':', '_')}`)}**`,
        inline: true
      },
      {
        name: `\\${money} ${t('commons:price')}`,
        value: `**${ct(`payments.${item.payment}`, { value: price })}**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(buy)

    util.send(ct('success'), embed)
  }
}

module.exports = Buy
