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
          id: 'member',
          type: 'realMember',
          default: message => message.member
        },
        {
          id: 'active',
          match: 'flag',
          flag: '--actives'
        }
      ]
    })
  }

  async exec ({ ct, t, db, util }, { member, active }) {
    const data = await db.users.get(member.id)
    const inventory = active ? data.activeItems : data.items
    const itemsIds = Object.keys(inventory)

    if (!itemsIds.length) {
      return util.send(active ? ct('noActiveItems') : ct('noItems'))
    }

    const uses = t('commons:uses')
    const items = itemsIds.reduce((desc, id) => {
      const itemId = id.replace(':', '_')
      const { emoji } = getItemById(id)
      return desc + `${emoji} **${t(`items:${itemId}`)}: \`${inventory[id]}\` ${uses}**\n`
    }, '')

    const embed = new LilirucaEmbed()
      .setDescription(items)

    util.send(ct('success', { member: member.displayName }), embed)
  }
}

module.exports = Inventory
