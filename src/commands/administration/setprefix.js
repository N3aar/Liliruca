const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { PREFIX_MAX_LIMIT, EMOJIS: { pencil } } = require('@constants')

class SetPrefix extends LilirucaCommand {
  constructor () {
    super('setprefix', {
      aliases: ['prefix', 'pfx'],
      emoji: pencil,
      userPermissions: 'MANAGE_GUILD',
      editable: true,
      args: [
        {
          id: 'prefix',
          type: Argument.validate('string', (m, phrase) => phrase.length < PREFIX_MAX_LIMIT),
          otherwise: message => message.ct('error', { max: PREFIX_MAX_LIMIT })
        }
      ]
    })
  }

  async exec ({ util, guild, db, ct }, { prefix }) {
    await db.guilds.updateOne(guild.id, prefix, 'prefix')
    util.send(ct('success', { prefix }))
  }
}

module.exports = SetPrefix
