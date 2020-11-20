const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItem, addItemInInventory, removeItem } = require('@utils/items')
const { gear, money } = require('@constants/emojis')

class Saw extends LilirucaCommand {
  constructor () {
    super('saw', {
      aliases: ['sw'],
      emoji: gear,
      clientPermissions: [
        'embedLinks',
        'externalEmojis'
      ],
      args: [
        {
          id: 'amount',
          type: Argument.range('integer', 2, Infinity),
          default: 2
        }
      ]
    })
  }

  async exec ({ t, ct, db, author, util }, { amount }) {
    const data = await db.users.ensure(author.id)

    const woods = data.items.wood || 0
    if (woods < amount) {
      return util.send(ct('noWood', { missing: amount - woods }))
    }

    const price = amount * 20
    if (data.money < price) {
      return util.send(ct('noMoney', { missing: price - data.money }))
    }

    const required = (amount % 2) === 0 ? amount : amount - 1
    const result = required / 2

    const { emoji: wood } = getItem('wood')
    const { emoji: plank } = getItem('wooden-plank')

    const fields = [
      {
        name: `${wood} ${t('commons:process')}`,
        value: `**x${required} ${getItemName('wood', t)}**`,
        inline: true
      },
      {
        name: `${plank} ${t('commons:result')}`,
        value: `**x${result} ${getItemName('wooden-plank', t)}**`,
        inline: true
      },
      {
        name: `${money} ${t('commons:price')}`,
        value: `**$${price}**`,
        inline: true
      }
    ]

    removeItem(data, 'items', 'wood', required)
    addItemInInventory(data, 'items', 'wooden-plank', amount)
    addItemInInventory(data, 'statistics', 'wooden-plank', amount)

    const values = {
      money: data.money - price
    }

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\${gear} ${ct('success')}`, embed)
  }
}

module.exports = Saw
