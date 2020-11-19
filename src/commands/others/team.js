const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { displayDate } = require('@utils/date')
const { TEAM } = require('@constants/constant')
const { key } = require('@constants/emojis')

class Team extends LilirucaCommand {
  constructor () {
    super('team', {
      aliases: ['tm'],
      emoji: key,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ]
    })
  }

  exec ({ t, ct, util, language }) {
    const team = TEAM.map(user => {
      const tags = user.tags.join(' | ')
      const joined = displayDate(user.joined, language)
      const status = t(`commons:${user.status}`)

      const name = `${user.emoji} ${user.name}`
      const value = `**${(tags)}\n${(joined)}\n${(status)}**`

      return {
        name,
        value
      }
    })

    const embed = new LilirucaEmbed()
      .addFields(team)
      .setTimestamp()

    util.send(`\\${key} ${ct('success')}`, embed)
  }
}

module.exports = Team
