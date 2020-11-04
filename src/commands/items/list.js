const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { capitalize } = require('@utils/util')
const { items, getItemById, getItemDescription, normalizeItemPrice, getItemSale, getItemsByMaterialId, getItemName } = require('@utils/items')
const { ITEMS_TYPES, EMOJIS: { page } } = require('@constants')

class List extends LilirucaCommand {
  constructor () {
    super('list', {
      aliases: ['lt', 'catalog', 'items'],
      emoji: page,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'itemId',
          type: 'itemId'
        },
        {
          id: 'filter',
          match: 'option',
          flag: ['--type', '--t'],
          type: ITEMS_TYPES
        },
        {
          id: 'page',
          match: 'option',
          flag: ['--page', '--p'],
          type: Argument.range('integer', 1, Infinity),
          default: 1
        }
      ]
    })
  }

  exec ({ ct, t, util }, { itemId, page, filter }) {
    if (itemId) {
      return this.runItemProfile(itemId, { ct, t, util })
    }

    const ids = Object.keys(items)
    const array = filter ? ids.filter(id => items[id].type === filter) : ids

    const pageIndex = (page - 1) * 4
    const itemsIds = array.slice(pageIndex, pageIndex + 4)

    if (!itemsIds.length) {
      return util.send(ct('noPage'))
    }

    const fields = itemsIds.map(id => {
      const { item, fields } = List.getItemInfo(id, t, ct)
      const parseValue = value => /`/g.test(value) ? value : `\`${value}\``
      return {
        name: `${item.emoji} ${getItemName(id, t)}`,
        value: fields.map(field => `**${field.name}**: ${parseValue(field.value)}`)
      }
    })

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\📃 ${ct('success', { page })}`, embed)
  }

  runItemProfile (itemId, { ct, t, util }) {
    const { item, fields } = List.getItemInfo(itemId, t, ct, false)
    const itemName = getItemName(itemId, t)

    const embed = new LilirucaEmbed()
      .setTitle(`${item.emoji} ${itemName}`)
      .setDescription(`**${getItemDescription(itemId, t)}**`)
      .addFields(fields.map(f => ({ ...f, name: `${f.emoji} ${f.name}`, value: `**${f.value}**` })))

    const items = getItemsByMaterialId(itemId)
    if (items.length) {
      embed.addField(ct('usedIn'), items.map(([id, i]) => `**${i.emoji} ${getItemName(id, t)}** \`[${id}]\``), true)
    }

    util.send(`\\📃 ${ct('itemProfile', { itemName })}`, embed)
  }

  static getItemInfo (itemId, t, ct, blankspace = true) {
    const item = getItemById(itemId)

    const fields = [
      { name: ct('itemId'), value: itemId, inline: true, emoji: '\\📌' },
      { name: ct('itemType'), value: capitalize(item.type), inline: true, emoji: '\\🏷️' },
      { name: t('commons:price'), value: normalizeItemPrice(item.payment, item.price, t), inline: true, emoji: '\\🏦' },
      { name: ct('itemUtility'), value: ct('itemUses', { value: item.value }), inline: true, emoji: '\\⚙️' },
      { name: ct('itemSale'), value: normalizeItemPrice(item.payment, getItemSale(item), t), inline: true, emoji: '\\🛒' }
    ]

    if (item.energy) {
      fields.push({ name: ct('itemEnergy'), value: `\\⚡ ${item.energy}`, inline: true, emoji: '\\🔋' })
    }

    if (item.required) {
      fields.push({ name: ct('itemRequired'), value: `${t(`commons:${item.place}`)} Level ${item.required}`, inline: true, emoji: '\\🔒' })
    }

    if (item.materials) {
      const materials = Object.keys(item.materials)
        .map(material => `${getItemById(material).emoji} \`x${item.materials[material]} ${getItemName(material, t)}\``)
        .join('\n')

      fields.push({ name: t('commons:materials'), value: (blankspace ? '\n' : '') + materials, inline: true, emoji: '\\🧰' })
    }

    return { item, fields }
  }
}

module.exports = List
