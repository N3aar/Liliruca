const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { items, getItemById } = require('@utils/items')
const { EMOJIS: { page } } = require('@constants')

class List extends LilirucaCommand {
  constructor () {
    super('list', {
      aliases: ['lt', 'catalog'],
      emoji: page,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'page',
          type: Argument.range('integer', 1, Infinity),
          default: 1
        }
      ]
    })
  }

  async exec ({ ct, t, util }, { page }) {
    const pageIndex = (page - 1) * 4
    const itemsIds = Object.keys(items).slice(pageIndex, pageIndex + 4)

    if (!itemsIds.length) {
      return util.send(ct('noPage'))
    }

    const fields = itemsIds.map(id => {
      const item = getItemById(id)
      const name = t(`items:${id.replace(':', '_')}`)

      item.id = id
      item.price = ct(item.payment, { value: item.price })
      item.place = t(`commons:${item.place}`)

      return {
        name: `${item.emoji} ${name}`,
        value: ct('item', item) + (item.required ? ct('place', item) : '')
      }
    })

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(ct('success', { page }), embed)
  }
}

module.exports = List
