const SupportGuildUtil = require('@utils/supportGuildUtil')
const LilirucaListener = require('@structures/LilirucaListener')

class ReadyListener extends LilirucaListener {
  constructor () {
    super('ready', {
      category: 'client',
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    const { client } = this
    const readyMessage = `Bot started successfully! (${client.users.size} users & ${client.guilds.size} servers)`

    client.logger.success(readyMessage)
    SupportGuildUtil.rebootChannel(client, readyMessage)
    client.editStatus('online', {
      game: {
        name: `@${client.user.username} help`,
        type: 0
      }
    })
  }
}

module.exports = ReadyListener
