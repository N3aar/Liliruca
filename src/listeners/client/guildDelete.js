const { WebhookClient, RichEmbed } = require('discord.js')
const { Listener } = require('discord-akairo')

class GuildDeleteListener extends Listener {
  constructor () {
    super('guildDelete', {
      category: 'client',
      emitter: 'client'
    })
  }

  exec (guild) {
    const guildsWeebhook = new WebhookClient(process.env.WK_GUILDS_ID, process.env.WK_GUILDS_TOKEN)
    if (guildsWeebhook) {
      const embed = new RichEmbed()
        .setColor('#db3939')
        .setThumbnail(guild.iconURL)
        .addField('Name', guild.name, true)
        .addField('Owner', guild.owner.user.tag, true)
        .addField('Users', guild.memberCount, true)
        .addField('Region', guild.region, true)
        .setFooter(guild.id)
        .setTimestamp(guild.createdAt)

      guildsWeebhook.send(this.guilds.cache.size, embed)
    }

    const channel = this.channels.cache.get(process.env.STATS_CHANNEL_ID)
    if (channel) {
      channel.setName(`📌 ${this.guilds.cache.size} Guilds`)
    }

    this.db.guilds.delete(guild.id)
  }
}

module.exports = GuildDeleteListener
