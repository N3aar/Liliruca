const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemById } = require('@utils/items')
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
          id: 'active',
          match: 'flag',
          flag: '--actives'
        },
        {
          id: 'ids',
          match: 'flag',
          flag: '--id'
        }
      ]
    })
  }

  async exec ({ ct, t, db, util }, { member, page, active, ids }) {
    const data = await db.users.get(member.id)
    const inventory = active ? data.activeItems : data.items

    const pageIndex = (page - 1) * 15
    const itemsIds = Object.keys(inventory).slice(pageIndex, pageIndex + 15)

    if (!itemsIds.length) {
      return util.send(active ? ct('noActiveItems') : ct('noItems'))
    }

    const items = itemsIds.map(id => {
      const { emoji } = getItemById(id)
      const showId = ids ? `\`[${id}]\`` : ''
      return `${emoji} **x${inventory[id]} ${t(`items:${id.replace(':', '_')}`)}** ${showId}`
    }, '')

    const embed = new LilirucaEmbed()
      .setDescription(items.join('\n'))

    util.send(`\\🎒 ${ct('success', { member: member.displayName, page })}`, embed)
  }
}

module.exports = Inventory
