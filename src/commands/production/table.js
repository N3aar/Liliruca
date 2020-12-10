const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItem } = require('@utils/items')
const { PLACE_NAMES, PLACES_RESOURCES, PLACE_MAX_LEVEL, UPGRADE_PRICE, STORAGE_PRICES, UPGRADE_MATERIALS } = require('@constants/constant')
const emojis = require('@constants/emojis')

const table = {
  [PLACE_NAMES.FARM]: {
    operation: 'division',
    value: 5,
    amount: 500,
    money: '$100'
  },

  [PLACE_NAMES.FISHING]: {
    operation: 'multiply',
    value: 2,
    amount: 200,
    money: '$400'
  },

  [PLACE_NAMES.MINING]: {
    operation: 'multiply',
    value: 3,
    amount: 300,
    money: '$900'
  },

  list (price) {
    return [1, 2, 3, 4].map(value => `Level ${value + 1}: **$${value * price}**`).join('\n')
  }
}

class Table extends LilirucaCommand {
  constructor () {
    super('table', {
      aliases: ['tb'],
      emoji: emojis.clipboard,
      clientPermissions: [
        'embedLinks',
        'externalEmojis'
      ],
      args: [
        {
          id: 'place',
          type: 'place',
          otherwise: message => message.t('errors:noPlace')
        }
      ],
      flags: [
        {
          id: 'storage',
          flags: ['storage']
        }
      ]
    })
  }

  exec ({ t, ct, parsedPrefix, util }, { place, storage }) {
    const type = storage ? 'storage' : 'table'
    const fields = this[type]({ t, ct, place, prefix: parsedPrefix })

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\${emojis.clipboard} ${ct(type, { place: t(`commons:${place}`) })}`, embed)
  }

  table ({ t, ct, place }) {
    const upgrade = UPGRADE_PRICE[place]
    const resource = PLACES_RESOURCES[place]
    const emojisResource = emojis[resource]
    const sell = table[place]
    const prices = table.list(upgrade)

    const { material, amount } = UPGRADE_MATERIALS[place]
    const { emoji } = getItem(material)

    sell.operation = ct(sell.operation)
    sell.emoji = emojisResource[Math.floor(Math.random() * emojisResource.length)]

    return [
      {
        name: `\\${emojis.gear} ${t('commons:upgrade')}`,
        value: ct(`upgrade.${place}`, { prices })
      },
      {
        name: `\\${emojis[place]} ${ct('maxUpgrade')}`,
        value: `Level ${PLACE_MAX_LEVEL}`
      },
      {
        name: `\\${emojis.abacus} ${t('commons:formula')}`,
        value: ct('formula', { price: upgrade })
      },
      {
        name: `${emoji} ${t('commons:materials')}`,
        value: ct('materials', { material: getItemName(material, t), amount })
      },
      {
        name: `\\${emojis.pack} ${t('commons:sell')}`,
        value: ct('sell', sell)
      }
    ]
  }

  storage ({ t, ct, place, prefix }) {
    const storage = STORAGE_PRICES[place]

    const { material, amount } = UPGRADE_MATERIALS[place]
    const { emoji } = getItem(material)
    const materials = Math.floor(amount / UPGRADE_MATERIALS.storage)

    return [
      {
        name: `\\${emojis.gear} ${t('commons:upgrade')}`,
        value: `Level 1: **$0**\n${table.list(storage)}\n...`
      },
      {
        name: `\\${emojis.abacus} ${t('commons:formula')}`,
        value: ct('formula', { price: storage })
      },
      {
        name: `${emoji} ${t('commons:materials')}`,
        value: ct('materials', { material: getItemName(material, t), amount: materials })
      },
      {
        name: `\\${emojis.lamp} ${t('commons:tip')}`,
        value: ct('calculate', { prefix })
      }
    ]
  }
}

module.exports = Table
