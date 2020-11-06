const LilirucaCommand = require('@structures/LilirucaCommand')
const { getItemById } = require('@utils/items')
const { EMOJIS: { hammerwrench } } = require('@constants')

class Equip extends LilirucaCommand {
  constructor () {
    super('equip', {
      aliases: ['ep'],
      emoji: hammerwrench,
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
    const item = getItemById(itemId)
    if (!item.tool) {
      return util.send(ct('noTool'))
    }

    const data = await db.users.get(author.id)

    data.tools[item.tool] = itemId
    data.markModified('tools')

    db.users.update(data, {})

    util.send(`\\${hammerwrench} ${ct('success')}`)
  }
}

module.exports = Equip
