const ClientUtil = require('@utils/ClientUtil')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { version } = require('@package')
const { parseDuration, displayDate } = require('@utils/date')
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
    const botInviteUrl = ClientUtil.getBotInvite(client.user.id, ClientUtil.getBotPermissions())
    const avatar = client.user.displayAvatarURL({ format: 'png', size: 4096 })

    const about = {
      guildCount: client.guilds.cache.size.toLocaleString(),
      usersCount: client.users.cache.size.toLocaleString(),
      commands: client.commands.size.toLocaleString(),
      uptime: parseDuration(client.uptime, language),
      createdAt: displayDate(client.user.createdAt, language),
      joinedAt: displayDate(guild.joinedAt, language)
    }

    const fields = [
      {
        name: `\\📌 ${ct('supportGuild')}`,
        value: `[Clique Aqui](${SUPPORT_GUILD})`,
        inline: true
      },
      {
        name: `\\📎 ${ct('inviteMe')}`,
        value: `[Clique Aqui](${botInviteUrl})`,
        inline: true
      },
      {
        name: '\\💾 Github',
        value: '[Clique Aqui](https://github.com/vNear/Liliruca)',
        inline: true
      },
      {
        name: `\\🎓 ${ct('version')}`,
        value: `**${version}**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .setAuthor(ct('success'), avatar)
      .setThumbnail(avatar)
      .setDescription(ct('about', about))
      .addFields(fields)

    util.send(embed)
  }
}

module.exports = Botinfo
