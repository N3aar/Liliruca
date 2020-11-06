const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItemById } = require('@utils/items')
const { EMOJIS: { backpack } } = require('@constants')

class Inventory extends LilirucaCommand {
  constructor () {
    super('inventory', {
      aliases: ['inv'],
      emoji: backpack,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'page',
          type: Argument.range('integer', 1, Infinity),
          default: 1
        },
        {
          id: 'member',
          type: 'realMember',
          default: message => message.member
        },
        {
          id: 'ids',
          match: 'flag',
          flag: '--id'
        }
      ]
    })
  }

  async exec ({ ct, t, db, util }, { member, page, ids }) {
    const data = await db.users.get(member.id)

    const pageIndex = (page - 1) * 15
    const itemsIds = Object.keys(data.items).slice(pageIndex, pageIndex + 15)

    if (!itemsIds.length) {
      return util.send(ct('noItems'))
    }

    const items = itemsIds.map(id => {
      const { emoji } = getItemById(id)
      const showId = ids ? `\`[${id}]\`` : ''
      return `${emoji} **x${data.items[id]} ${getItemName(id, t)}** ${showId}`
    }, '')

    const embed = new LilirucaEmbed()
      .setDescription(items.join('\n'))

    util.send(`\\${backpack} ${ct('success', { member: member.displayName, page })}`, embed)
  }
}

module.exports = Inventory
