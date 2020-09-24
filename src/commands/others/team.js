const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { displayDate } = require('@utils/date')
const { bold } = require('@utils/util')
const { TEAM, EMOJIS: { key } } = require('@constants')

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
      const value = `${bold(tags)}\n${bold(joined)}\n${bold(status)}`

      return { name, value }
    })

    const embed = new LilirucaEmbed()
      .addFields(team)
      .setTimestamp()

    util.send(ct('success'), embed)
  }
}

module.exports = Team
