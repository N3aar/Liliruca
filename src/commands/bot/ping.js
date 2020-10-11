const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { EMOJIS: { antenna, lamp, beatingHeart } } = require('@constants')

class Ping extends LilirucaCommand {
  constructor () {
    super('ping', {
      aliases: ['pg'],
      emoji: antenna,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  async exec ({ util, ct, client, createdTimestamp }) {
    const hearbeat = Math.round(Date.now() - createdTimestamp)
    const APIlatency = Math.round(client.ws.ping)

    const sent = await util.send(ct('calc'))
    const latency = Math.round(sent.createdTimestamp - createdTimestamp)

    const ping = [
      {
        name: ct('latency'),
        value: `**\\${lamp} ${latency}ms**`,
        inline: true
      },
      {
        name: ct('heartbeat'),
        value: `**\\${beatingHeart} ${hearbeat}ms**`,
        inline: true
      },
      {
        name: ct('apiLatency'),
        value: `**\\${antenna} ${APIlatency}ms**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(ping)

    sent.edit(ct('success'), embed)
  }
}

module.exports = Ping
