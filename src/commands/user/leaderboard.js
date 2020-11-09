const { MessageAttachment } = require('discord.js')
const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { drawLeaderboard } = require('@utils/Canvas')
const { PLACES, LEADERBOARD_TYPES, EMOJIS: { trophy } } = require('@constants')

class Leaderboard extends LilirucaCommand {
  constructor () {
    super('leaderboard', {
      aliases: ['lb', 'ranking', 'rank'],
      emoji: trophy,
      editable: true,
      typing: true,
      clientPermissions: 'ATTACH_FILES',
      args: [
        {
          id: 'type',
          type: Argument.union(LEADERBOARD_TYPES, 'place'),
          otherwise: message => message.ct('error', { types: LEADERBOARD_TYPES.join(' | ') })
        },
        {
          id: 'page',
          type: Argument.range('integer', 1, 50, true),
          default: 1
        },
        {
          id: 'guildOnly',
          match: 'flag',
          flag: '--guild'
        }
      ]
    })
  }

  async exec ({ t, ct, client, guild, util, db }, { type, page, guildOnly }) {
    const ids = guildOnly && guild.members.cache.map(member => member.id)
    const data = await db.users.ranking(type, ids, 5, 5 * (page - 1))

    if (data.length < 5) {
      return util.send(ct('noPage'))
    }

    const fetchedUsers = data.map(d => client.users.cache.get(d.id) || client.users.fetch(d.id))
    const users = await Promise.all(fetchedUsers)
    const attach = new MessageAttachment(await drawLeaderboard(data, type, ct, users), 'leaderboard.png')
    const parsed = t(`commons:${PLACES.includes(type) ? 'storages.' : ''}${type}`)

    util.send(`\\${trophy} ${ct('success', { type: parsed, page })}`, attach)
  }
}

module.exports = Leaderboard
