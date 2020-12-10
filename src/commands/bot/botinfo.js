const ClientUtil = require('@utils/clientUtil')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { version } = require('@package')
const { parseDuration, displayDate } = require('@utils/date')
const { SUPPORT_GUILD } = require('@constants/constant')
const { bookmark } = require('@constants/emojis')

class Botinfo extends LilirucaCommand {
  constructor () {
    super('botinfo', {
      aliases: ['info'],
      emoji: bookmark,
      clientPermissions: 'embedLinks'
    })
  }

  async exec ({ t, ct, language, util, guild, client }) {
    const botInviteUrl = ClientUtil.getBotInvite(client.user.id, ClientUtil.getBotPermissions())
    const avatar = client.user.dynamicAvatarURL('png', 4096)
    const clickHere = t('commons:clickHere')

    const about = {
      guildCount: client.guilds.size.toLocaleString(),
      usersCount: client.users.size.toLocaleString(),
      commands: client.commandHandler.modules.size,
      uptime: parseDuration(client.uptime, language),
      createdAt: displayDate(client.user.createdAt, language),
      joinedAt: displayDate(guild.joinedAt, language)
    }

    const fields = [
      {
        name: `\\📌 ${ct('supportGuild')}`,
        value: `[${clickHere}](${SUPPORT_GUILD})`,
        inline: true
      },
      {
        name: `\\📎 ${ct('inviteMe')}`,
        value: `[${clickHere}](${botInviteUrl})`,
        inline: true
      },
      {
        name: '\\💾 Github',
        value: `[${clickHere}](https://github.com/vNear/Liliruca)`,
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
