const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { dependencies } = require('@package')
const { EMOJIS: { wrench } } = require('@constants')

class Technical extends LilirucaCommand {
  constructor () {
    super('technical', {
      aliases: ['tech'],
      emoji: wrench,
      editable: true,
      clientPermissions: 'EMBED_LINKS'
    })
  }

  exec ({ ct, client, util }) {
    const djs = dependencies['discord.js']
    const akairo = dependencies['discord-akairo']
    const memoryUsage = (process.memoryUsage().heapUsed / 1048576).toFixed(2)
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
        name: `\\📚 ${ct('library')}`,
        value: `**Discord.js v${djs.replace('^', '')}**`,
        inline: true
      },
      {
        name: '\\📦 Framework',
        value: `**Discord Akairo v${akairo.replace('^', '')}**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\${wrench} ${ct('success')}`, embed)
  }
}

module.exports = Technical
