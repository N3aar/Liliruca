const SupportGuildUtil = require('@utils/supportGuildUtil')
const LilirucaListener = require('@structures/LilirucaListener')

class GuildDeleteListener extends LilirucaListener {
  constructor () {
    super('guildDelete', {
      category: 'client',
      emitter: 'client',
      event: 'guildDelete'
    })
  }

  exec (guild) {
    SupportGuildUtil.clientLeaveGuild(this.client, guild)
    this.client.db.guilds.delete(guild.id)
  }
}

module.exports = GuildDeleteListener
