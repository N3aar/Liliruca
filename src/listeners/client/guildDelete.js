const { WebhookClient, MessageEmbed } = require('discord.js')
const { Listener } = require('discord-akairo')

class GuildDeleteListener extends Listener {
  constructor () {
    super('guildDelete', {
      category: 'client',
      emitter: 'client',
      event: 'guildDelete'
    })
  }

  exec (guild) {
    const { client } = this
    const guildsWeebhook = new WebhookClient(process.env.WK_GUILDS_ID, process.env.WK_GUILDS_TOKEN)
    if (guildsWeebhook) {
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

      const embed = new MessageEmbed()
        .setColor('#db3939')
        .addFields(fields)
        .setAuthor(guild.name, guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
        .setFooter(guild.id)
        .setTimestamp(guild.createdAt)

      guildsWeebhook.send(embed)
    }

    const channel = client.channels.cache.get(process.env.STATS_CHANNEL_ID)
    if (channel) {
      channel.setName(`📌 ${client.guilds.cache.size} Guilds`)
    }

    client.db.guilds.delete(guild.id)
  }
}

module.exports = GuildDeleteListener
