const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { STORAGE_PRICES, EMOJIS } = require('@constants')
const { getStoragePrice } = require('@utils/util')
const { Argument } = require('discord-akairo')

const bold = string => `**${string}**`

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
    const storage = STORAGE_PRICES[place]
    const price = getStoragePrice(storage, firstValue, secondValue)

    const value = bold(`${firstValue} \\➡ ${secondValue}`)
    const result = bold(price)
    const storageName = t(`commons:${place}_storage`)

    const embed = new LilirucaEmbed()
      .addField(ct('value'), value, true)
      .addField(ct('result'), result, true)
      .setFooter(storageName)

    util.send(ct('success'), embed)
  }
}

module.exports = Calculate
