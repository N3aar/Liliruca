const { Permissions } = require('discord.js')
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

  static getBotPermissions () {
    return Permissions.FLAGS.ADMINISTRATOR |
      Permissions.FLAGS.VIEW_CHANNEL |
      Permissions.FLAGS.SEND_MESSAGES |
      Permissions.FLAGS.EMBED_LINKS |
      Permissions.FLAGS.ATTACH_FILES |
      Permissions.FLAGS.READ_MESSAGE_HISTORY |
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS
  }

  static getBotInvite (clientId, permissions) {
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot`
  }

  async exec ({ t, ct, language, util, guild, client }) {
    const botInviteUrl = Botinfo.getBotInvite(client.user.id, Botinfo.getBotPermissions())
    const avatar = client.user.displayAvatarURL({ format: 'png', size: 4096 })

    const abount = {
      guildCount: client.guilds.cache.size.toLocaleString(),
      usersCount: client.users.cache.size.toLocaleString(),
      commands: client.commands.size.toLocaleString(),
      uptime: parseDuration(client.uptime, language),
      createdAt: displayDate(client.user.createdAt, language),
      joinedAt: displayDate(guild.joinedAt, language)
    }

    const fields = [
      {
        name: `\\🎓 ${ct('version')}`,
        value: `**${version}**`,
        inline: true
      },
      {
        name: `\\📌 ${ct('supportGuild')}`,
        value: `[Clique Aqui](${SUPPORT_GUILD})`,
        inline: true
      },
      {
        name: `\\📎 ${ct('inviteMe')}`,
        value: `[Clique Aqui](${botInviteUrl})`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .setAuthor(ct('success'), avatar)
      .setThumbnail(avatar)
      .setDescription(ct('about', abount))
      .addFields(fields)

    util.send(embed)
  }
}

module.exports = Botinfo
