const LilirucaCommand = require('@structures/LilirucaCommand')
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
          id: 'item',
          type: 'item',
          otherwise: message => message.t('errors:noItem')
        }
      ]
    })
  }

  async exec ({ db, ct, author, util }, { item }) {
    if (!item.tool) {
      return util.send(ct('noTool'))
    }

    const data = await db.users.get(author.id)

    data.tools[item.tool] = item.id
    data.markModified('tools')

    db.users.update(data, {})

    util.send(`\\${hammerwrench} ${ct('success')}`)
  }
}

module.exports = Equip
