const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { random } = require('@utils/util')
const { getItemName, getItemById, getItemInInventoryByTier, removeItem, addItemInInventory } = require('@utils/items')
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
      ]
    })
  }

  async exec ({ t, ct, util, db, author }) {
    const data = await db.users.get(author.id)

    if (data.energy < ENERGY_COST) {
      return util.send(t('errors:noEnergy'))
    }

    const saw = getItemInInventoryByTier(data.activeItems, 'axe')
    if (!saw) {
      return util.send(ct('noSaw'))
    }

    const amount = random(saw.item.max, saw.item.min, true)
    const wood = getItemById('wood')
    const fields = [
      {
        name: `${saw.item.emoji} ${t('commons:tool')}`,
        value: `**${getItemName(saw, t)}**`,
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
      energy: data.energy - ENERGY_COST
    }

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    db.users.update(data, values)

    util.send(ct('success'), embed)
  }
}

module.exports = Wood
