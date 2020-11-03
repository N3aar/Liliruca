const LilirucaCommand = require('@structures/LilirucaCommand')
const { getItemById } = require('@utils/items')
const { EMOJIS: { open } } = require('@constants')

class Active extends LilirucaCommand {
  constructor () {
    super('active', {
      aliases: ['use', 'at'],
      emoji: open,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'itemId',
          type: 'itemId',
          otherwise: message => message.t('errors:noItem')
        }
      ]
    })
  }

  async exec ({ ct, t, db, member, util }, { itemId }) {
    const item = getItemById(itemId)
    if (item.inactive) {
      return util.send(ct('inative'))
    }

    const data = await db.users.get(member.id)

    if (data.activeItems[itemId]) {
      return util.send(ct('already'))
    }

    if (!data.items[itemId]) {
      return util.send(ct('missing'))
    }

    if (item.required && data[item.place].level < item.required) {
      return util.send(t('errors:locked'))
    }

    data.activeItems[itemId] = data.items[itemId]
    data.markModified('activeItems')

    delete data.items[itemId]
    data.markModified('items')

    db.users.update(data, {})

    util.send(`\\🔓 ${ct('success')}`)
  }
}

module.exports = Active
