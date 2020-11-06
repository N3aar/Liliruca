const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItemById, getToolInInventory, removeItem } = require('@utils/items')
const { EMOJIS: { drink, voltage } } = require('@constants')

class Energetic extends LilirucaCommand {
  constructor () {
    super('energetic', {
      aliases: ['et'],
      emoji: drink,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'itemId',
          type: 'itemId'
        }
      ]
    })
  }

  async exec ({ t, ct, author, db, util }, { itemId }) {
    const data = await db.users.get(author.id)

    const energetic = (data.items[itemId] && getItemById(itemId)) || getToolInInventory(data, 'energetic')
    if (!energetic) {
      return util.send(ct('noEnergetic'))
    }

    const energeticId = itemId || energetic.id
    const energeticItem = itemId ? energetic : energetic.item

    const fields = [
      {
        name: `\\${drink} ${t('commons:drink')}`,
        value: `**${getItemName(energeticId, t)}**`,
        inline: true
      },
      {
        name: ct('recoveredEnergy'),
        value: `**${voltage} ${energeticItem.energy}**`,
        inline: true
      }
    ]

    const energy = data.energy + energeticItem.energy
    const values = {
      energy: Math.min(energy, 100)
    }

    removeItem(data, 'items', energeticId)

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    util.send(`\\${drink} ${ct('success')}`, embed)
  }
}

module.exports = Energetic
