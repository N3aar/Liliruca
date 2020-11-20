const { Guild } = require('eris')

class SupportGuildUtil {
  static guildIntegrationOptions (guild, type, embedColor) {
    if (!(guild instanceof Guild)) {
      return { content: `${['I joined the server', 'I left the server'][type]} ${guild.id}` }
    }

    const fields = [
      {
        name: '\\👥 Members',
        value: `**${guild.memberCount} Users**`,
        inline: true
      },
      {
        name: '\\🌍 Region',
        value: `**${guild.region}**`,
        inline: true
      },
      {
        name: '\\🥇 Premium Tier',
        value: `**Tier ${guild.premiumTier}**`,
        inline: true
      }
    ]

    return [
      {
        color: embedColor,
        author: { name: guild.name, icon_url: guild.dynamicIconURL() },
        footer: { text: guild.id },
        timestamp: guild.createdAt,
        fields
      }
    ]
  }

  static guildIntegration (guild, client, type, embedColor) {
    if (!process.env.WK_GUILDS_ID || !process.env.WK_GUILDS_TOKEN) {
      return
    }

    client.executeWebhook(
      process.env.WK_GUILDS_ID, process.env.WK_GUILDS_TOKEN,
      SupportGuildUtil.guildIntegrationOptions(guild, type, embedColor)
    )
  }

  static updateStatsChannel (client) {
    if (!process.env.STATS_CHANNEL_ID) {
      return
    }

    client.editChannel(process.env.STATS_CHANNEL_ID, {
      name: `📌 ${client.guilds.size} Guilds`
    })
  }

  static clientJoinGuild (client, guild) {
    SupportGuildUtil.updateStatsChannel(client)
    return SupportGuildUtil.guildIntegration(guild, client, 0, 0x47d350)
  }

  static clientLeaveGuild (client, guild) {
    SupportGuildUtil.updateStatsChannel(client)
    return SupportGuildUtil.guildIntegration(guild, client, 1, 0xdb3939)
  }

  static rebootChannel (client, message) {
    if (!process.env.REBOOT_CHANNEL) {
      return
    }

    client.createMessage(process.env.REBOOT_CHANNEL, message)
  }
}

module.exports = SupportGuildUtil
