const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { EMOJIS: { antenna, lamp, beatingHeart } } = require('@constants')

class Ping extends LilirucaCommand {
  constructor () {
    super('ping', {
      aliases: ['pg'],
      emoji: antenna,
      editable: true
    })
  }

  async exec ({ util, ct, client, createdTimestamp }) {
    const hearbeat = Math.round(Date.now() - createdTimestamp)
    const APIlatency = Math.round(client.ws.ping)

    const sent = await util.send(ct('calc'))
    const latency = Math.round(sent.createdTimestamp - createdTimestamp)

    const embed = new LilirucaEmbed()
      .addField(ct('latency'), `**\\${lamp} ${latency}ms**`, true)
      .addField(ct('heartbeat'), `**\\${beatingHeart} ${hearbeat}ms**`, true)
      .addField(ct('apiLatency'), `**\\${antenna} ${APIlatency}ms**`, true)

    sent.edit(ct('success'), embed)
  }
}

module.exports = Ping
