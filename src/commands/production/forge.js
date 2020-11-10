const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItem, removeItem, addItemInInventory } = require('@utils/items')
const { ORES, EMOJIS: { fire, money } } = require('@constants')

class Forge extends LilirucaCommand {
  constructor () {
    super('forge', {
      aliases: ['fg'],
      emoji: fire,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'ore',
          type: ORES,
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
    const data = await db.users.get(author.id)
    const coal = data.items.coal || 0

    if (coal < amount) {
      return util.send(ct('noCoal'))
    }

    const ores = data.items[ore] || 0

    if (ores < amount) {
      return util.send(ct('missing'))
    }

    const item = getItem(ore)
    const price = (item.rarity * 50) * amount
    const barAmount = item.amount * amount

    if (data.money < price) {
      return util.send(ct('noMoney', { missing: price - data.money }))
    }

    const bar = getItem(item.forge)
    const fields = [
      {
        name: `${item.emoji} ${t('commons:ore')}`,
        value: `**x${amount} ${getItemName(ore, t)}**`,
        inline: true
      },
      {
        name: `${bar.emoji} ${t('commons:forged')}`,
        value: `**x${barAmount} ${getItemName(item.forge, t)}**`,
        inline: true
      },
      {
        name: `${money} ${t('commons:price')}`,
        value: `**$${price}**`,
        inline: true
      }
    ]

    removeItem(data, 'items', ore, amount)
    removeItem(data, 'items', 'coal', amount)
    addItemInInventory(data, 'items', item.forge, barAmount)

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
