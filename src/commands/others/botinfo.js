const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration, displayDate } = require('@utils/date')
const { bold } = require('@utils/util')
const { version } = require('@package')
const { SUPPORT_GUILD, EMOJIS: { bookmark } } = require('@constants')

class Botinfo extends LilirucaCommand {
  constructor () {
    super('botinfo', {
      aliases: ['bot', 'info'],
      emoji: bookmark,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  async exec ({ t, ct, language, util, guild, client }) {
    const links = [
      `[${ct('inviteMe')}](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=379968)`,
      `[${ct('supportGuild')}](${SUPPORT_GUILD})`
    ]

    const botinfo = [
      {
        name: `\\🎓 ${ct('version')}`,
        value: bold(version),
        inline: true
      },
      {
        name: `\\🔧 ${ct('language')}`,
        value: bold('javascript'),
        inline: true
      },
      {
        name: `\\📁 ${ct('commands')}`,
        value: bold(client.commands.size),
        inline: true
      },
      {
        name: `\\👥 ${ct('users')}`,
        value: bold(client.users.cache.size),
        inline: true
      },
      {
        name: `\\📌 ${ct('guilds')}`,
        value: bold(client.guilds.cache.size),
        inline: true
      },
      {
        name: `\\💬 ${ct('channels')}`,
        value: bold(client.channels.cache.size),
        inline: true
      },
      {
        name: `\\⌚ ${ct('uptime')}`,
        value: bold(parseDuration(client.uptime, language)),
        inline: true
      },
      {
        name: `\\📅 ${t('commons:createdAt')}`,
        value: bold(displayDate(client.user.createdAt, language)),
        inline: true
      },
      {
        name: `\\📆 ${t('commons:joinedAt')}`,
        value: bold(displayDate(guild.joinedAt, language)),
        inline: true
      },
      {
        name: `\\🔗 ${ct('links')}`,
        value: bold(links.join(' | ')),
        inline: false
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(botinfo)

    util.send(ct('success'), embed)
  }
}

module.exports = Botinfo
