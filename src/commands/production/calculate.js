const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getStoragePrice } = require('@utils/util')
const { getItemById } = require('@utils/items')
const { STORAGE_PRICES, UPGRADE_MATERIALS, EMOJIS } = require('@constants')

class Calculate extends LilirucaCommand {
  constructor () {
    super('calculate', {
      aliases: ['calc', 'cl'],
      emoji: EMOJIS.abacus,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'place',
          type: 'place',
          otherwise: message => message.ct('invalidPlace')
        },
        {
          id: 'firstValue',
          type: Argument.range('integer', 1, 1000000),
          default: 1
        },
        {
          id: 'secondValue',
          type: Argument.range('integer', 1, 1000000),
          default: 1
        }
      ]
    })
  }

  exec ({ util, t, ct }, { place, firstValue, secondValue }) {
    const highest = Math.max(firstValue, secondValue)
    const lower = Math.min(firstValue, secondValue)

    const storage = STORAGE_PRICES[place]
    const price = getStoragePrice(storage, lower, highest)

    const { material, amount } = UPGRADE_MATERIALS[place]
    const { emoji } = getItemById(material)
    const materials = getStoragePrice(Math.floor(amount / 3), lower, highest)

    const fields = [
      {
        name: `\\🧪 ${t('commons:value')}`,
        value: `**${lower} \\➡ ${highest}**`,
        inline: true
      },
      {
        name: `\\💰 ${t('commons:price')}`,
        value: `**$${price}**`,
        inline: true
      },
      {
        name: `${emoji} ${t('commons:materials')}`,
        value: `**x${materials} ${t(`items:${material}`)}**`,
        inline: true
      }
    ]
    const storageName = `${EMOJIS[place]} ${t(`commons:storages.${place}`)}`
    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(storageName)

    util.send(ct('success'), embed)
  }
}

module.exports = Calculate
