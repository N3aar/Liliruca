const { Listener } = require('discord-akairo')

class RawListener extends Listener {
  constructor () {
    super('raw', {
      category: 'ws',
      emitter: 'client',
      event: 'raw'
    })
  }

  exec () {
    this.client.eventCount += 1
  }
}

module.exports = RawListener
