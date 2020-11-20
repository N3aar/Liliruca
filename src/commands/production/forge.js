const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItem, removeItem, addItemInInventory } = require('@utils/items')
const { fire, money } = require('@constants/emojis')

class Forge extends LilirucaCommand {
  constructor () {
    super('forge', {
      aliases: ['fg'],
      emoji: fire,
      clientPermissions: [
        'embedLinks',
        'externalEmojis'
      ],
      args: [
        {
          id: 'ore',
          type: Argument.validate('item', (m, p, value) => value.forge),
          otherwise: message => message.ct('noOre')
        },
        {
          id: 'amount',
          type: Argument.range('integer', 1, Infinity),
          default: 1
        }
      ]
    })
  }

  async exec ({ t, ct, util, db, author }, { ore, amount }) {
    const data = await db.users.ensure(author.id)
    const coal = data.items.coal || 0

    if (coal < amount) {
      return util.send(ct('noCoal'))
    }

    const ores = data.items[ore.id] || 0

    if (ores < amount) {
      return util.send(ct('missing'))
    }

    const price = (ore.rarity * 50) * amount
    const barAmount = ore.amount * amount

    if (data.money < price) {
      return util.send(ct('noMoney', { missing: price - data.money }))
    }

    const bar = getItem(ore.forge)
    const fields = [
      {
        name: `${ore.emoji} ${t('commons:ore')}`,
        value: `**x${amount} ${getItemName(ore.id, t)}**`,
        inline: true
      },
      {
        name: `${bar.emoji} ${t('commons:forged')}`,
        value: `**x${barAmount} ${getItemName(ore.forge, t)}**`,
        inline: true
      },
      {
        name: `${money} ${t('commons:price')}`,
        value: `**$${price}**`,
        inline: true
      }
    ]

    removeItem(data, 'items', ore.id, amount)
    removeItem(data, 'items', 'coal', amount)
    addItemInInventory(data, 'items', ore.forge, barAmount)

    const values = {
      money: data.money - price
    }

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\${fire} ${ct('success')}`, embed)
  }
}

module.exports = Forge
