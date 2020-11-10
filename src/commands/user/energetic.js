const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getToolInInventory, removeItem } = require('@utils/items')
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
          id: 'item',
          type: 'item'
        }
      ]
    })
  }

  async exec ({ t, ct, author, db, util }, { item }) {
    const data = await db.users.get(author.id)

    if (item && !data.items[item.id]) {
      return ct('noEnergetic')
    }

    const energetic = item || getToolInInventory(data, 'energetic')
    if (!energetic) {
      return util.send(ct('noEnergetic'))
    }

    const fields = [
      {
        name: `\\${drink} ${t('commons:drink')}`,
        value: `**${getItemName(energetic.id, t)}**`,
        inline: true
      },
      {
        name: ct('recoveredEnergy'),
        value: `**${voltage} ${energetic.energy}**`,
        inline: true
      }
    ]

    const energy = data.energy + energetic.energy
    const values = {
      energy: Math.min(energy, 100)
    }

    removeItem(data, 'items', energetic.id)

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    util.send(`\\${drink} ${ct('success')}`, embed)
  }
}

module.exports = Energetic
