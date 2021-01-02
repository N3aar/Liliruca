const { Guild } = require('eris')
const { pad } = require('./util')

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
        name: '\\🟣 Boost Tier',
        value: `**Tier ${guild.premiumTier}**`,
        inline: true
      }
    ]

    return {
      embeds: [{
        color: embedColor,
        author: { name: guild.name, icon_url: guild.dynamicIconURL() },
        footer: { text: guild.id },
        timestamp: new Date(guild.createdAt),
        fields
      }]
    }
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

  static evalIntegrationOptions (author, guildName, code) {
    const tag = author.username + author.discriminator
    return {
      embeds: [{
        color: 0xff9900,
        author: { name: tag, icon_url: author.avatarURL },
        description: code,
        footer: { text: guildName }
      }]
    }
  }

  static evalIntegration (client, author, guildName, code) {
    if (!process.env.WK_EVAL_ID || !process.env.WK_EVAL_TOKEN) {
      return
    }

    client.executeWebhook(
      process.env.WK_EVAL_ID, process.env.WK_EVAL_TOKEN,
      SupportGuildUtil.evalIntegrationOptions(author, guildName, code)
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

  static commandLog (client, command) {
    if (!process.env.COMMAND_CHANNEL_ID) {
      return
    }

    const date = new Date()
    const hr = pad(date.getHours())
    const min = pad(date.getMinutes())
    const content = `[${hr}:${min}] ${command.id}`

    client.createMessage(process.env.COMMAND_CHANNEL_ID, { content })
  }

  static clientError (client, error, shard) {
    if (!process.env.ERROR_CHANNEL_ID) {
      return
    }

    const embed = {
      color: 0xdb3939,
      timestamp: new Date(),
      title: `\\❌ Client Error - Shard #${shard}`,
      description: `\`\`\`${error}\`\`\``
    }

    client.createMessage(process.env.ERROR_CHANNEL_ID, { embed })
  }

  static errorChannel (client, channelId, language, message, err) {
    if (!process.env.ERROR_CHANNEL_ID) {
      return
    }

    const t = client.locales.getT(language)
    const content = `\\⚠️ **${t('errors:command_error')}**`
    const embed = {
      color: 0xdb3939,
      timestamp: new Date(),
      fields: [
        { name: '\\📄 Message', value: `\`\`\`${message}\`\`\`` },
        { name: '\\❌ Error', value: `\`\`\`${err}\`\`\`` }
      ]
    }

    client.logger.error(err)
    client.createMessage(channelId, { content })
    client.createMessage(process.env.ERROR_CHANNEL_ID, { embed })
  }

  static rebootChannel (client, message) {
    if (!process.env.REBOOT_CHANNEL_ID) {
      return
    }

    client.createMessage(process.env.REBOOT_CHANNEL_ID, { content: message })
  }
}

module.exports = SupportGuildUtil
