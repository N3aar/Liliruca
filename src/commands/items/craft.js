const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, removeItem, addItemInInventory, autoEquipItem } = require('@utils/items')
const { hammerwrench, items, money } = require('@constants/emojis')

class Craft extends LilirucaCommand {
  constructor () {
    super('craft', {
      aliases: ['cf'],
      emoji: hammerwrench,
      clientPermissions: [
        'embedLinks',
        'externalEmojis'
      ],
      args: [
        {
          id: 'item',
          type: 'item',
          craftable: true,
          otherwise: message => message.ct('noCraftable')
        },
        {
          id: 'amount',
          type: Argument.range('integer', 1, Infinity),
          default: 1
        }
      ]
    })
  }

  async exec ({ t, ct, util, db, author }, { item, amount }) {
    const data = await db.users.ensure(author.id)
    const price = 50 * amount

    if (data.money < price) {
      return util.send(ct('noMoney', { missing: price - data.money }))
    }

    if (item.required && data[item.place].level < item.required) {
      return util.send(t('errors:locked'))
    }

    for (const material in item.materials) {
      const value = data.items[material] || 0
      const required = item.materials[material] * amount

      if (value < required) {
        return util.send(ct('noMaterial', { material: getItemName(material, t), missing: required - value }))
      }
    }

    const materials = Object.keys(item.materials).map(name => `x${item.materials[name]} ${getItemName(name, t)}`)
    const fields = [
      {
        name: `${item.emoji} ${t('commons:created')}`,
        value: `**x${item.value * amount} ${getItemName(item.id, t)}**`,
        inline: true
      },
      {
        name: `\\${items} ${t('commons:materials')}`,
        value: `**${materials.join('\n')}**`,
        inline: true
      },
      {
        name: `\\${money} ${t('commons:price')}`,
        value: `**$${price}**`,
        inline: true
      }
    ]

    addItemInInventory(data, 'items', item.id, item.value * amount)

    for (const material in item.materials) {
      removeItem(data, 'items', material, item.materials[material] * amount)
    }

    if (item.tool && data.tools.autoequip) {
      autoEquipItem(data, item)
    }

    const values = {
      money: data.money - price
    }

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\${hammerwrench} ${ct('success')}`, embed)
  }
}

module.exports = Craft
