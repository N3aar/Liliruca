const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { VERSION } = require('eris')
const { wrench } = require('@constants/emojis')

class Technical extends LilirucaCommand {
  constructor () {
    super('technical', {
      aliases: ['tech'],
      emoji: wrench,
      clientPermissions: 'embedLinks'
    })
  }

  exec ({ ct, client, util }) {
    const memoryUsage = (process.memoryUsage().rss / 1048576).toFixed(2)
    const fields = [
      {
        name: '\\⚙️ Engine',
        value: `**Node.js ${process.version}**`,
        inline: true
      },
      {
        name: `\\💾 ${ct('database')}`,
        value: '**MongoDB**',
        inline: true
      },
      {
        name: `\\📊 ${ct('memoryUsage')}`,
        value: `**${memoryUsage} mb**`,
        inline: true
      },
      {
        name: `\\📇 ${ct('events')}`,
        value: `**${ct('eventCount', { count: client.eventCount.toLocaleString() })}**`,
        inline: true
      },
      {
        name: `\\📡 ${ct('requests')}`,
        value: `**${ct('requestCount', { count: client.requestCount.toLocaleString() })}**`,
        inline: true
      },
      {
        name: `\\📚 ${ct('library')}`,
        value: `**Eris v${VERSION}**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\${wrench} ${ct('success')}`, embed)
  }
}

module.exports = Technical
