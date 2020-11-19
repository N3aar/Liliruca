const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { randomChances, random } = require('@utils/util')
const { getItemName, getItem, getToolInInventory, removeItem, addMultipleItemsInInventory } = require('@utils/items')
const { ENERGY_COST, EMOJIS: { mining } } = require('@constants')

class Mine extends LilirucaCommand {
  constructor () {
    super('mine', {
      aliases: ['mn'],
      emoji: mining,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'uses',
          type: Argument.range('integer', 1, 10, true),
          default: 1
        },
        {
          id: 'item',
          type: Argument.validate('item', (m, p, value) => value.tool === 'pickaxe')
        },
        {
          id: 'all',
          match: 'flag',
          flag: '--all'
        }
      ]
    })
  }

  async exec ({ t, ct, util, db, author }, { uses, item, all }) {
    const data = await db.users.ensure(author.id)

    if (!data.mining.level) {
      return util.send(t('errors:locked'))
    }

    if (all) {
      uses = Math.floor(data.energy / 10)
    }

    const energyCost = ENERGY_COST * uses
    if (!energyCost || data.energy < energyCost) {
      return util.send(t('errors:noEnergy'))
    }

    if (item && !data.items[item.id]) {
      return util.send(ct('noPickaxe'))
    }

    const pickaxe = item || getToolInInventory(data, 'pickaxe')
    if (!pickaxe) {
      return util.send(ct('noPickaxe'))
    }

    if (data.items[pickaxe.id] < uses) {
      return util.send(ct('insufficient'))
    }

    const ores = {}

    for (let i = 0; i < uses; i++) {
      Mine.randomOres(ores, pickaxe)
    }

    const oresMined = Object.keys(ores).slice(1)
    const parsed = oresMined.reduce((value, ore) => {
      const name = getItemName(ore, t)
      const amount = ores[ore]
      return value + `x${amount} ${name}\n`
    }, '')

    const { emoji } = getItem(oresMined[0])
    const fields = [
      {
        name: `${pickaxe.emoji} ${t('commons:tool')}`,
        value: `**x${uses} ${getItemName(pickaxe.id, t)}**`,
        inline: true
      },
      {
        name: `${emoji} ${t('commons:ore')}`,
        value: `**${parsed}**`,
        inline: true
      }
    ]

    if (ores.coal) {
      const coal = getItem('coal')

      fields.push({
        name: `${coal.emoji} ${t('commons:bonus')}`,
        value: `**x${ores.coal} ${getItemName('coal', t)}**`,
        inline: true
      })
    }

    addMultipleItemsInInventory(data, 'items', ores)
    addMultipleItemsInInventory(data, 'statistics', { ...ores, [pickaxe.id]: uses })
    removeItem(data, 'items', pickaxe.id, uses)

    const values = {
      energy: data.energy - energyCost
    }

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    util.send(`\\${mining} ${ct('success')}`, embed)
  }

  static randomOres (ores, pickaxe) {
    const itemReward = randomChances(pickaxe.chances)
    const ore = pickaxe.rewards[itemReward]
    const amount = random(ore.max, ore.min, true)
    const coal = random(3)

    if (coal) {
      const limit = pickaxe.rewards.coal
      const coalAmount = random(limit.min, limit.max, true)

      if (!ores.coal) {
        ores.coal = 0
      }

      ores.coal += coalAmount
    }

    if (!ores[itemReward]) {
      ores[itemReward] = 0
    }

    ores[itemReward] += amount
  }
}

module.exports = Mine
