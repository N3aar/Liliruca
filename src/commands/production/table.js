const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItemById } = require('@utils/items')
const { PLACE_NAMES, PLACES_RESOURCES, PLACE_MAX_LEVEL, UPGRADE_PRICE, STORAGE_PRICES, UPGRADE_MATERIALS, EMOJIS } = require('@constants')

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
      emoji: EMOJIS.clipboard,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'place',
          type: 'place',
          otherwise: message => message.ct('noPlace')
        },
        {
          id: 'storage',
          match: 'flag',
          flag: '--storage'
        }
      ]
    })
  }

  exec ({ t, ct, prefix, util }, { place, storage }) {
    const type = storage ? 'storage' : 'table'
    const fields = this[type]({ t, ct, place, prefix })

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\${EMOJIS.clipboard} ${ct(type, { place: t(`commons:${place}`) })}`, embed)
  }

  table ({ t, ct, place }) {
    const upgrade = UPGRADE_PRICE[place]
    const emojis = EMOJIS[PLACES_RESOURCES[place]]
    const sell = table[place]
    const prices = table.list(upgrade)

    const { material, amount } = UPGRADE_MATERIALS[place]
    const { emoji } = getItemById(material)

    sell.operation = ct(sell.operation)
    sell.emoji = emojis[Math.floor(Math.random() * emojis.length)]

    return [
      {
        name: `\\${EMOJIS.gear} ${t('commons:upgrade')}`,
        value: ct(`upgrade.${place}`, { prices })
      },
      {
        name: `\\${EMOJIS[place]} ${ct('maxUpgrade')}`,
        value: `Level ${PLACE_MAX_LEVEL}`
      },
      {
        name: `\\${EMOJIS.abacus} ${t('commons:formula')}`,
        value: ct('formula', { price: upgrade })
      },
      {
        name: `${emoji} ${t('commons:materials')}`,
        value: ct('materials', { material: getItemName(material, t), amount })
      },
      {
        name: `\\${EMOJIS.pack} ${t('commons:sell')}`,
        value: ct('sell', sell)
      }
    ]
  }

  storage ({ t, ct, place, prefix }) {
    const storage = STORAGE_PRICES[place]

    const { material, amount } = UPGRADE_MATERIALS[place]
    const { emoji } = getItemById(material)
    const materials = Math.floor(amount / 3)

    return [
      {
        name: `\\${EMOJIS.gear} ${t('commons:upgrade')}`,
        value: `Level 1: **$0**\n${table.list(storage)}\n...`
      },
      {
        name: `\\${EMOJIS.abacus} ${t('commons:formula')}`,
        value: ct('formula', { price: storage })
      },
      {
        name: `${emoji} ${t('commons:materials')}`,
        value: ct('materials', { material: getItemName(material, t), amount: materials })
      },
      {
        name: `\\${EMOJIS.lamp} ${t('commons:tip')}`,
        value: ct('calculate', { prefix })
      }
    ]
  }
}

module.exports = Table
