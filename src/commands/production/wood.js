const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { random } = require('@utils/util')
const { getItemName, getItemById, getToolInInventory, removeItem, addItemInInventory } = require('@utils/items')
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
          type: Argument.range('integer', 1, 10, true),
          default: 1
        },
        {
          id: 'itemId',
          type: 'itemId'
        }
      ]
    })
  }

  async exec ({ t, ct, util, db, author }, { uses, itemId }) {
    const data = await db.users.get(author.id)

    const energyCost = ENERGY_COST * uses
    if (data.energy < energyCost) {
      return util.send(t('errors:noEnergy'))
    }

    const tool = (data.items[itemId] && getItemById(itemId)) || getToolInInventory(data, 'axe')
    if (!tool) {
      return util.send(ct('noAxe'))
    }

    const toolId = itemId || tool.id
    const toolItem = itemId ? tool : tool.item

    if (data.items[tool.id] < uses) {
      return util.send(ct('insufficient'))
    }

    const wood = getItemById('wood')
    const amount = random((toolItem.max * uses), (toolItem.min * uses), true)

    const fields = [
      {
        name: `${toolItem.emoji} ${t('commons:tool')}`,
        value: `**x${uses} ${getItemName(toolId, t)}**`,
        inline: true
      },
      {
        name: `${wood.emoji} ${t('commons:wood')}`,
        value: `**${amount}**`,
        inline: true
      }
    ]

    removeItem(data, 'items', toolId, uses)
    addItemInInventory(data, 'items', 'wood', amount)

    const values = {
      energy: data.energy - energyCost
    }

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    db.users.update(data, values)

    util.send(`\\${axe} ${ct('success')}`, embed)
  }
}

module.exports = Wood
