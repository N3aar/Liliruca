const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const emojis = require('@utils/emojis')
const { PREFIX_MAX_LIMIT } = require('@constants')

class SetPrefix extends LilirucaCommand {
  constructor () {
    super('setprefix', {
      aliases: ['prefix', 'pfx'],
      emoji: emojis.pencil,
      userPermissions: 'MANAGE_GUILD',
      editable: true,
      args: [
        {
          id: 'prefix',
          type: Argument.validate('string', str => str.length < PREFIX_MAX_LIMIT),
          otherwise: message => message.ct('prefixIsLoongMuch', { max: PREFIX_MAX_LIMIT })
        }
      ]
    })
  }

  async exec ({ util, guild, db, ct }, { prefix }) {
    await db.guilds.set(guild.id, prefix, 'prefix')
    const success = prefix ? 'changedPrefix' : 'resetPrefix'
    util.send(ct(success, { prefix }))
  }
}

module.exports = SetPrefix
