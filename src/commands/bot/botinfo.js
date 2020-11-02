const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration, displayDate } = require('@utils/date')
const { version } = require('@package')
const { SUPPORT_GUILD, EMOJIS: { bookmark } } = require('@constants')
const { Permissions } = require('discord.js')

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
    return Permissions.FLAGS.SEND_MESSAGES |
      Permissions.FLAGS.VIEW_CHANNEL |
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS |
      Permissions.FLAGS.ATTACH_FILES |
      Permissions.FLAGS.READ_MESSAGE_HISTORY
  }

  static getBotInvite (clientId, permissions) {
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot`
  }

  async exec ({ t, ct, language, util, guild, client }) {
    const botInviteUrl = Botinfo.getBotInvite(client.user.id, Botinfo.getBotPermissions())
    const botInvite = `[${ct('inviteMe')}](${botInviteUrl})`
    const supportServer = `[${ct('supportGuild')}](${SUPPORT_GUILD})`
    const links = [botInvite, supportServer]
    const memoryUsage = (process.memoryUsage().heapUsed / 1048576).toFixed(2)

    const botinfo = [
      {
        name: `\\🎓 ${ct('version')}`,
        value: `${version}`,
        inline: true
      },
      {
        name: `\\🔧 ${ct('nodeVersion')}`,
        value: process.versions.node,
        inline: true
      },

      {
        name: `\\🧮 ${ct('memoryUsage')}`,
        value: memoryUsage,
        inline: true
      },
      {
        name: `\\📁 ${ct('commands')}`,
        value: `${client.commands.size}`,
        inline: true
      },
      {
        name: `\\👥 ${ct('users')}`,
        value: `${client.users.cache.size}`,
        inline: true
      },
      {
        name: `\\📌 ${ct('guilds')}`,
        value: `${client.guilds.cache.size}`,
        inline: true
      },
      {
        name: `\\💬 ${ct('channels')}`,
        value: `${client.channels.cache.size}`,
        inline: true
      },
      {
        name: `\\⌚ ${ct('uptime')}`,
        value: `${parseDuration(client.uptime, language)}`,
        inline: true
      },
      {
        name: `\\📅 ${t('commons:createdAt')}`,
        value: `${displayDate(client.user.createdAt, language)}`,
        inline: true
      },
      {
        name: `\\📆 ${t('commons:joinedAt')}`,
        value: `${displayDate(guild.joinedAt, language)}`,
        inline: true
      },
      {
        name: `\\🔗 ${ct('links')}`,
        value: `${links.join(' | ')}`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(botinfo)

    util.send(ct('success'), embed)
  }
}

module.exports = Botinfo
