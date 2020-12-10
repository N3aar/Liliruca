const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getStoragePrice } = require('@utils/util')
const { getItemName, getItem } = require('@utils/items')
const { STORAGE_PRICES, UPGRADE_MATERIALS } = require('@constants/constant')
const emojis = require('@constants/emojis')

class Calculate extends LilirucaCommand {
  constructor () {
    super('calculate', {
      aliases: ['calc', 'cl'],
      emoji: emojis.abacus,
      clientPermissions: 'embedLinks',
      args: [
        {
          id: 'place',
          type: 'place',
          otherwise: message => message.ct('invalidPlace')
        },
        {
          id: 'firstValue',
          type: 'number',
          forceMax: 99999,
          forceMin: 1,
          default: 1
        },
        {
          id: 'secondValue',
          type: 'number',
          forceMax: 99999,
          forceMin: 1,
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
    const { emoji } = getItem(material)
    const materials = getStoragePrice(Math.floor(amount / UPGRADE_MATERIALS.storage), lower, highest)

    const fields = [
      {
        name: `\\🧪 ${t('commons:value')}`,
        value: `**Level ${lower} \\➡ Level ${highest}**`,
        inline: true
      },
      {
        name: `\\💰 ${t('commons:price')}`,
        value: `**$${price.toLocaleString()}**`,
        inline: true
      },
      {
        name: `${emoji} ${t('commons:materials')}`,
        value: `**x${materials} ${getItemName(material, t)}**`,
        inline: true
      }
    ]
    const storageName = `${emojis[place]} ${t(`commons:storages.${place}`)}`
    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(storageName)

    util.send(`\\${emojis.abacus} ${ct('success')}`, embed)
  }
}

module.exports = Calculate
