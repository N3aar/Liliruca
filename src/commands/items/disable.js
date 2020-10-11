const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { hasItem } = require('@utils/items')
const { EMOJIS: { locked } } = require('@constants')

class Disable extends LilirucaCommand {
  constructor () {
    super('disable', {
      aliases: ['ds'],
      emoji: locked,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'itemId',
          type: Argument.validate('lowercase', (message, phrase) => hasItem(phrase)),
          otherwise: message => message.ct('noItem')
        }
      ]
    })
  }

  async exec ({ ct, t, db, member, util }, { itemId }) {
    const data = await db.users.get(member.id)

    if (!data.activeItems[itemId]) {
      return util.send(ct('noActive'))
    }

    data.items[itemId] = data.activeItems[itemId]
    data.markModified('items')

    delete data.activeItems[itemId]
    data.markModified('activeItems')

    db.users.update(data, {})

    util.send(ct('success'))
  }
}

module.exports = Disable
