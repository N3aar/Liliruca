const LilirucaCommand = require('@structures/LilirucaCommand')
const { EMOJIS: { wrench } } = require('@constants')

class Autoequip extends LilirucaCommand {
  constructor () {
    super('autoequip', {
      aliases: ['ae'],
      emoji: wrench,
      editable: true
    })
  }

  async exec ({ db, ct, t, author, util }) {
    const data = await db.users.ensure(author.id)
    const autoEquip = !data.tools.autoequip
    const status = autoEquip ? 'enable' : 'disable'
    const parsed = t(`commons:${status}`).toLowerCase()

    data.tools.autoequip = autoEquip
    data.markModified('tools')
    data.save()

    util.send(`\\${wrench} ${ct('success', { status: parsed })}`)
  }
}

module.exports = Autoequip
