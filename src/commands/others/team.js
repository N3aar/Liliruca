const moment = require('moment')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { EMOJIS, TEAM } = require('@constants')

const bold = string => `**${string}**`

class Team extends LilirucaCommand {
  constructor () {
    super('team', {
      aliases: ['tm'],
      emoji: EMOJIS.key,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS',
        'SEND_MESSAGES'
      ]
    })
  }

  exec ({ t, ct, util, guild }) {
    const { me: bot } = guild

    const team = TEAM.map(user => {
      const tags = user.tags.join(' | ')
      const joined = moment(user.joined).format('L')
      const status = t(`commons:${user.status}`)

      const name = `${user.emoji} ${user.name}`
      const value = `${bold(tags)}\n${bold(joined)}\n${bold(status)}`

      return { name, value }
    })

    const embed = new LilirucaEmbed()
      .setFooter(bot.displayName, bot.user.displayAvatarURL())
      .addFields(team)
      .setTimestamp()

    util.send(ct('success'), embed)
  }
}

module.exports = Team
