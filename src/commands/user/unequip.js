const LilirucaCommand = require('@structures/LilirucaCommand')
const { getItemById } = require('@utils/items')
const { EMOJIS: { nut } } = require('@constants')

class Unequip extends LilirucaCommand {
  constructor () {
    super('unequip', {
      aliases: ['uq'],
      emoji: nut,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'itemId',
          type: 'itemId',
          otherwise: message => message.t('errors:noItem')
        }
      ]
    })
  }

  async exec ({ db, ct, author, util }, { itemId }) {
    const data = await db.users.get(author.id)

    const item = getItemById(itemId)
    if (data.tools[item.tool] !== itemId) {
      return util.send(ct('noEquipped'))
    }

    delete data.tools[item.tool]
    data.markModified('tools')

    db.users.update(data, {})

    util.send(`\\${nut} ${ct('success')}`)
  }
}

module.exports = Unequip
