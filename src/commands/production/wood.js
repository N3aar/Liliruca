const { Argument } = require('discord-akairo')
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
      ],
      args: [
        {
          id: 'uses',
          type: Argument.range('integer', 1, 10),
          default: 1
        }
      ]
    })
  }

  async exec ({ t, ct, util, db, author }, { uses }) {
    const data = await db.users.get(author.id)

    const energyCost = ENERGY_COST * uses
    if (data.energy < energyCost) {
      return util.send(t('errors:noEnergy'))
    }

    const saw = getItemInInventoryByTier(data.activeItems, 'axe', 5)
    if (!saw) {
      return util.send(ct('noSaw'))
    }

    if (data.activeItems[saw.id] < uses) {
      return util.send(ct('insufficient'))
    }

    const wood = getItemById('wood')
    const amount = random((saw.item.max * uses), (saw.item.min * uses), true)

    const fields = [
      {
        name: `${saw.item.emoji} ${t('commons:tool')}`,
        value: `**x${uses} ${getItemName(saw.id, t)}**`,
        inline: true
      },
      {
        name: `${wood.emoji} ${t('commons:wood')}`,
        value: `**${amount}**`,
        inline: true
      }
    ]

    removeItem(data, 'activeItems', saw.id, uses)
    addItemInInventory(data, 'items', 'wood', amount)

    const values = {
      energy: data.energy - energyCost
    }

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    db.users.update(data, values)

    util.send(ct('success'), embed)
  }
}

module.exports = Wood
