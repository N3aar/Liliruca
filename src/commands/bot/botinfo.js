const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration, displayDate } = require('@utils/date')
const { version } = require('@package')
const { SUPPORT_GUILD, EMOJIS: { bookmark } } = require('@constants')

class Botinfo extends LilirucaCommand {
  constructor () {
    super('botinfo', {
      aliases: ['info'],
      emoji: bookmark,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  async exec ({ t, ct, language, util, guild, client }) {
    const links = [
      `[${ct('inviteMe')}](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=379976)`,
      `[${ct('supportGuild')}](${SUPPORT_GUILD})`
    ]

    const botinfo = [
      {
        name: `\\🎓 ${ct('version')}`,
        value: `**${version}**`,
        inline: true
      },
      {
        name: `\\🔧 ${ct('language')}`,
        value: '**Javascript**',
        inline: true
      },
      {
        name: `\\📁 ${ct('commands')}`,
        value: `**${client.commands.size}**`,
        inline: true
      },
      {
        name: `\\👥 ${ct('users')}`,
        value: `**${client.users.cache.size}**`,
        inline: true
      },
      {
        name: `\\📌 ${ct('guilds')}`,
        value: `**${client.guilds.cache.size}**`,
        inline: true
      },
      {
        name: `\\💬 ${ct('channels')}`,
        value: `**${client.channels.cache.size}**`,
        inline: true
      },
      {
        name: `\\⌚ ${ct('uptime')}`,
        value: `**${parseDuration(client.uptime, language)}**`,
        inline: true
      },
      {
        name: `\\📅 ${t('commons:createdAt')}`,
        value: `**${displayDate(client.user.createdAt, language)}**`,
        inline: true
      },
      {
        name: `\\📆 ${t('commons:joinedAt')}`,
        value: `**${displayDate(guild.joinedAt, language)}**`,
        inline: true
      },
      {
        name: `\\🔗 ${ct('links')}`,
        value: `**${links.join(' | ')}**`,
        inline: false
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(botinfo)

    util.send(ct('success'), embed)
  }
}

module.exports = Botinfo
