const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItemById, addItemInInventory, removeItem } = require('@utils/items')
const { EMOJIS: { gear, money } } = require('@constants')

class Saw extends LilirucaCommand {
  constructor () {
    super('saw', {
      aliases: ['sw'],
      emoji: gear,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'amount',
          type: Argument.range('integer', 1, Infinity),
          default: 1
        }
      ]
    })
  }

  async exec ({ t, ct, db, author, util }, { amount }) {
    const data = await db.users.get(author.id)
    const woods = data.items.wood || 0
    const required = amount * 2

    if (woods < required) {
      return util.send(ct('noWood', { missing: required - woods }))
    }

    const price = amount * 20
    if (data.money < price) {
      return util.send(ct('noMoney', { missing: price - data.money }))
    }

    const { emoji: wood } = getItemById('wood')
    const { emoji: plank } = getItemById('wooden-plank')

    const fields = [
      {
        name: `${wood} ${t('commons:process')}`,
        value: `**x${required} ${getItemName('wood', t)}**`,
        inline: true
      },
      {
        name: `${plank} ${t('commons:result')}`,
        value: `**x${amount} ${getItemName('wooden-plank', t)}**`,
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
