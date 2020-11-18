const SupportGuildUtil = require('@utils/SupportGuildUtil')
const LilirucaListener = require('@structures/LilirucaListener')

class GuildCreateListener extends LilirucaListener {
  constructor () {
    super('guildCreate', {
      category: 'client',
      emitter: 'client',
      event: 'guildCreate'
    })
  }

  exec (guild) {
    SupportGuildUtil.clientJoinGuild(this.client, guild)
  }
}

module.exports = GuildCreateListener
