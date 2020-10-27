const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemById, removeItem, addItemInInventory } = require('@utils/items')
const { EMOJIS: { hammerwrench, items, money } } = require('@constants')

class Craft extends LilirucaCommand {
  constructor () {
    super('craft', {
      aliases: ['cf'],
      emoji: hammerwrench,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'itemId',
          type: (_, phrase) => {
            const item = getItemById(phrase)
            if (item && item.materials) {
              return phrase
            }
            return null
          },
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

  async exec ({ t, ct, util, db, author }, { itemId, amount }) {
    const data = await db.users.get(author.id)
    const price = 50 * amount

    if (data.money < price) {
      return util.send(ct('noMoney', { missing: price - data.money }))
    }

    const item = getItemById(itemId)

    if (item.required && data[item.place].level < item.required) {
      return util.send(t('errors:locked'))
    }

    for (const material in item.materials) {
      const value = data.items[material] || 0
      const required = item.materials[material] * amount

      if (value < required) {
        return util.send(ct('noMaterial', { material: t(`items:${material}`), missing: required - value }))
      }
    }

    const materials = Object.keys(item.materials).map(name => `x${item.materials[name]} ${t(`items:${name}`)}`)
    const fields = [
      {
        name: `${item.emoji} ${t('commons:created')}`,
        value: `**x${item.value * amount} ${t(`items:${itemId.replace(':', '_')}`)}**`,
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

    const inventory = data.activeItems[itemId] ? 'activeItems' : 'items'

    addItemInInventory(data, inventory, itemId, item.value * amount)

    for (const material in item.materials) {
      removeItem(data, 'items', material, item.materials[material] * amount)
    }

    const values = {
      money: data.money - price
    }

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(ct('success'), embed)
  }
}

module.exports = Craft
