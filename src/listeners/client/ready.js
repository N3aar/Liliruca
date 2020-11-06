const { Listener } = require('discord-akairo')

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      category: 'client',
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    const { client } = this
    const UsersSize = client.users.cache.size
    const GuildsSize = client.guilds.cache.size

    const readyMessage = `Bot started successfully! (${UsersSize} users & ${GuildsSize} servers)`
    const rebootChannel = client.channels.cache.get(process.env.REBOOT_CHANNEL)
    const statsChannel = client.channels.get(process.env.STATS_CHANNEL_ID)

    client.logger.success(readyMessage)

    if (rebootChannel) {
      rebootChannel.send(readyMessage)
    }

    if (statsChannel) {
      rebootChannel.setName(`📌 ${client.guilds.size} Guilds`)
    }

    client.user.setActivity(`@${client.user.username} help`)
  }
}

module.exports = ReadyListener
