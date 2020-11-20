const LilirucaCommand = require('@structures/LilirucaCommand')
const { nut } = require('@constants/emojis')

class Unequip extends LilirucaCommand {
  constructor () {
    super('unequip', {
      aliases: ['uq'],
      emoji: nut,
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
    const data = await db.users.ensure(author.id)

    if (data.tools[item.tool] !== item.id) {
      return util.send(ct('noEquipped'))
    }

    delete data.tools[item.tool]
    data.markModified('tools')

    db.users.update(data, {})

    util.send(`\\${nut} ${ct('success')}`)
  }
}

module.exports = Unequip
