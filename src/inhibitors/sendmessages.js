const { Inhibitor } = require('discord-akairo')

class SendMessages extends Inhibitor {
  constructor () {
    super('sendmessages', {
      type: 'pre',
      reason: 'send'
    })
  }

  exec ({ channel, guild }) {
    return !channel.permissionsFor(guild.me).has('SEND_MESSAGES')
  }
}

module.exports = SendMessages
