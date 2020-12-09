const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { capitalize } = require('@utils/util')
const { getItem, getItemDescription, normalizeItemPrice, getItemSale, getItemsByMaterialId, getItemName } = require('@utils/items')
const { ITEMS_TYPES } = require('@constants/constant')
const { pagecurl } = require('@constants/emojis')
const items = require('@items')

class List extends LilirucaCommand {
  constructor () {
    super('list', {
      aliases: ['lt', 'catalog', 'items'],
      emoji: pagecurl,
      clientPermissions: [
        'embedLinks',
        'externalEmojis'
      ],
      args: [
        {
          id: 'item',
          type: 'item'
        }
      ],
      flags: [
        {
          id: 'filter',
          flags: ['type', 't'],
          flagType: 'option',
          type: 'option',
          options: ITEMS_TYPES
        },
        {
          id: 'page',
          flags: ['page', 'p'],
          flagType: 'option',
          type: 'number',
          forceMin: 1,
          default: 1
        }
      ]
    })
  }

  exec ({ ct, t, util }, { item, page, filter }) {
    if (item) {
      return this.runItemProfile(item, { ct, t, util })
    }

    const ids = Object.keys(items)
    const array = filter ? ids.filter(id => items[id].type === filter) : ids

    const pageIndex = (page - 1) * 4
    const itemsIds = array.slice(pageIndex, pageIndex + 4)

    if (!itemsIds.length) {
      return util.send(ct('noPage'))
    }

    const list = itemsIds.map(id => {
      const item = getItem(id)
      const fields = List.getItemInfo(item, t, ct)
      const parseValue = value => /`/g.test(value) ? value : `\`${value}\``
      return {
        name: `${item.emoji} ${getItemName(id, t)}`,
        value: fields.map(field => `**${field.name}**: ${parseValue(field.value)}`).join('\n')
      }
    })

    const embed = new LilirucaEmbed()
      .addFields(list)

    util.send(`\\${pagecurl} ${ct('success', { page })}`, embed)
  }

  runItemProfile (item, { ct, t, util }) {
    const fields = List.getItemInfo(item, t, ct, false)
    const itemName = getItemName(item.id, t)

    const embed = new LilirucaEmbed()
      .setTitle(`${item.emoji} ${itemName}`)
      .setDescription(`**${getItemDescription(item.id, t)}**`)
      .addFields(fields.map(f => ({ ...f, name: `${f.emoji} ${f.name}`, value: `**${f.value}**` })))

    const items = getItemsByMaterialId(item.id)
    if (items.length) {
      embed.addField(ct('usedIn'), items.map(([id, i]) => `**${i.emoji} ${getItemName(id, t)}** \`[${id}]\``).join('\n'), true)
    }

    util.send(`\\📃 ${ct('itemProfile', { itemName })}`, embed)
  }

  static getItemInfo (item, t, ct, blankspace = true) {
    const fields = [
      { name: ct('itemId'), value: item.id, inline: true, emoji: '\\📌' },
      { name: ct('itemNum'), value: item.numId, inline: true, emoji: '\\📎' },
      { name: ct('itemType'), value: capitalize(item.type), inline: true, emoji: '\\🏷️' },
      { name: t('commons:price'), value: normalizeItemPrice(item.payment, item.price, t), inline: true, emoji: '\\🏦' },
      { name: ct('itemUtility'), value: ct('itemUses', { value: item.value }), inline: true, emoji: '\\⚙️' },
      { name: ct('itemSale'), value: normalizeItemPrice(item.payment, getItemSale(item), t), inline: true, emoji: '\\🛒' }
    ]

    if (item.energy) {
      fields.push({ name: ct('itemEnergy'), value: `${item.energy}`, inline: true, emoji: '\\🔋' })
    }

    if (item.required) {
      fields.push({ name: ct('itemRequired'), value: `${t(`commons:${item.place}`)} Level ${item.required}`, inline: true, emoji: '\\🔒' })
    }

    if (item.materials) {
      const materials = Object.keys(item.materials)
        .map(material => `${getItem(material).emoji} \`x${item.materials[material]} ${getItemName(material, t)}\``)
        .join('\n')

      fields.push({ name: t('commons:materials'), value: (blankspace ? '\n' : '') + materials, inline: true, emoji: '\\🧰' })
    }

    return fields
  }
}

module.exports = List
