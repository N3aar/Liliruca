const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { random } = require('@utils/util')
const { getItemById, getItemInInventoryByTier, removeItem, addItemInInventory } = require('@utils/items')
const { ENERGY_COST, EMOJIS: { axe } } = require('@constants')

class Wood extends LilirucaCommand {
  constructor () {
    super('wood', {
      aliases: ['wd'],
      emoji: axe,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'allEnergy',
          match: 'flag',
          flag: ['--all-energy', '--ae']
        }
      ]
    })
  }

  static getAmount (count, energy, saw) {
    let amount = 0
    let spentEnergy = energy
    for (let i = 0; i < count; i++) {
      if (spentEnergy >= ENERGY_COST) {
        amount += random(saw.item.max, saw.item.min, true)
        spentEnergy -= ENERGY_COST
      } else {
        break
      }
    }
    return { amount, spentEnergy }
  }

  async exec ({ t, ct, util, db, author }, { allEnergy }) {
    const data = await db.users.get(author.id)

    if (data.energy < ENERGY_COST) {
      return util.send(t('errors:noEnergy'))
    }

    const saw = getItemInInventoryByTier(data.activeItems, 'axe')
    if (!saw) {
      return util.send(ct('noSaw'))
    }

    const count = allEnergy ? Math.floor(data.energy / ENERGY_COST) : 1
    const { amount, spentEnergy } = Wood.getAmount(count, data.energy, saw)

    const wood = getItemById('wood')
    const fields = [
      {
        name: `${saw.item.emoji} ${t('commons:tool')}`,
        value: `**${t(`items:${saw.id.replace(':', '_')}`)}**`,
        inline: true
      },
      {
        name: `${wood.emoji} ${t('commons:wood')}`,
        value: `**${amount}**`,
        inline: true
      }
    ]

    removeItem(data, 'activeItems', saw.id)
    addItemInInventory(data, 'items', 'wood', amount)

    const values = {
      energy: spentEnergy
    }

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    db.users.update(data, values)

    util.send(`\\🪓 ${ct('success')}`, embed)
  }
}

module.exports = Wood
