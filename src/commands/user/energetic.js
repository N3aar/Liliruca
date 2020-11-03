const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemInInventoryByTier, getItemById, removeItem } = require('@utils/items')
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
          id: 'tier',
          type: Argument.range('integer', 1, 3),
          default: null
        }
      ]
    })
  }

  async exec ({ t, ct, author, db, util }, { tier }) {
    const data = await db.users.get(author.id)
    const id = tier && `energetic:${tier}`

    if (id && !data.activeItems[id]) {
      return util.send(ct('empty'))
    }

    const energetic = getItemById(id) || getItemInInventoryByTier(data.activeItems, 'energetic')
    if (!energetic) {
      return util.send(ct('noEnergetic'))
    }

    const energeticId = id || energetic.id
    const energeticItem = id ? energetic : energetic.item

    const fields = [
      {
        name: `\\${drink} ${t('commons:drink')}`,
        value: `**${t(`items:${energeticId.replace(':', '_')}`)}**`,
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

    removeItem(data, 'activeItems', energeticId)

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    util.send(`\\🥤 ${ct('success')}`, embed)
  }
}

module.exports = Energetic
