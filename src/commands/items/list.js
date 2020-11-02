const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { items, getItemById } = require('@utils/items')
const { ITEMS_TYPES, EMOJIS: { page } } = require('@constants')

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
        },
        {
          id: 'filter',
          match: 'option',
          flag: '--type',
          type: ITEMS_TYPES
        }
      ]
    })
  }

  async exec ({ ct, t, util }, { page, filter }) {
    const ids = Object.keys(items)
    const array = filter ? ids.filter(id => items[id].type === filter) : ids

    const pageIndex = (page - 1) * 4
    const itemsIds = array.slice(pageIndex, pageIndex + 4)

    if (!itemsIds.length) {
      return util.send(ct('noPage'))
    }

    const fields = itemsIds.map(id => {
      const item = Object.assign({}, getItemById(id))
      const name = t(`items:${id.replace(':', '_')}`)
      const sale = item.sale || Math.floor(item.price / item.value / 2)

      item.id = id
      item.price = ct(item.payment, { value: item.price })
      item.sale = ct(item.payment, { value: sale })
      item.place = t(`commons:${item.place}`)

      let value = ct('item', item)

      if (item.energy) {
        value += ct('energy', item)
      }

      if (item.required) {
        value += ct('place', item)
      }

      if (item.materials) {
        const materials = Object.keys(item.materials).map(m => `\` x${item.materials[m]} ${t(`items:${m}`)}\``).join('\n')
        value += `\n**${t('commons:materials')}:\n${materials}**`
      }

      return {
        name: `${item.emoji} ${name}`,
        value
      }
    })

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(ct('success', { page }), embed)
  }
}

module.exports = List
