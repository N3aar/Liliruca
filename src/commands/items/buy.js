const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, addItemInInventory, autoEquipItem } = require('@utils/items')
const { bank, pack, money } = require('@constants/emojis')

class Buy extends LilirucaCommand {
  constructor () {
    super('buy', {
      aliases: ['by'],
      emoji: bank,
      clientPermissions: [
        'embedLinks',
        'externalEmojis'
      ],
      args: [
        {
          id: 'item',
          type: 'item',
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

  async exec ({ ct, t, db, member, util }, { item, amount }) {
    const data = await db.users.ensure(member.id)

    if (item.required && data[item.place].level < item.required) {
      return util.send(t('errors:locked'))
    }

    if (data[item.payment] < (item.price * amount)) {
      return util.send(ct('noMoney'))
    }

    addItemInInventory(data, 'items', item.id, item.value * amount)

    if (item.tool && data.tools.autoequip) {
      autoEquipItem(data, item)
    }

    const price = item.price * amount
    const values = {
      [item.payment]: data[item.payment] - price
    }

    db.users.update(data, values)

    const buy = [
      {
        name: `\\${pack} ${t('commons:item')}`,
        value: `**${item.emoji} ${amount}x ${getItemName(item.id, t)}**`,
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

    util.send(`\\${bank} ${ct('success')}`, embed)
  }
}

module.exports = Buy
