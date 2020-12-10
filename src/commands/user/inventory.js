const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItem } = require('@utils/items')
const { getNickname } = require('@utils/discordUtil')
const { backpack } = require('@constants/emojis')

class Inventory extends LilirucaCommand {
  constructor () {
    super('inventory', {
      aliases: ['inv'],
      emoji: backpack,
      clientPermissions: 'embedLinks',
      args: [
        {
          id: 'member',
          type: 'member',
          default: message => message.member
        }
      ],
      flags: [
        {
          id: 'page',
          flags: ['page', 'p'],
          flagType: 'option',
          type: 'number',
          forceMin: 1,
          default: 1
        },
        {
          id: 'ids',
          flags: ['id']
        }
      ]
    })
  }

  async exec ({ ct, t, db, util }, { member, page, ids }) {
    const data = await db.users.ensure(member.id)

    const pageIndex = (page - 1) * 15
    const itemsIds = Object.keys(data.items).slice(pageIndex, pageIndex + 15)

    if (!itemsIds.length) {
      return util.send(ct('noItems'))
    }

    const items = itemsIds.map(id => {
      const { numId, emoji } = getItem(id)
      const showId = ids ? `\`[${numId}|${id}]\`` : ''
      return `${emoji} **x${data.items[id]} ${getItemName(id, t)}** ${showId}`
    }, '')

    const embed = new LilirucaEmbed()
      .setDescription(items.join('\n'))

    util.send(`\\${backpack} ${ct('success', { member: getNickname(member), page })}`, embed)
  }
}

module.exports = Inventory
