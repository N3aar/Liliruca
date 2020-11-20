const { MessageAttachment } = require('discord.js')
const { Argument } = require('discord-akairo')
const { createCanvas, loadImage } = require('canvas')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { PLACES, LEADERBOARD_TYPES } = require('@constants/constant')
const { trophy } = require('@constants/emojis')

class Leaderboard extends LilirucaCommand {
  constructor () {
    super('leaderboard', {
      aliases: ['lb', 'ranking', 'rank'],
      emoji: trophy,
      editable: false,
      typing: true,
      clientPermissions: 'attachFiles',
      args: [
        {
          id: 'type',
          type: Argument.union(LEADERBOARD_TYPES, 'place'),
          otherwise: message => message.ct('error', { types: LEADERBOARD_TYPES.join(' | ') })
        },
        {
          id: 'page',
          match: 'option',
          flag: ['--page', '--p'],
          type: Argument.range('integer', 1, 50, true),
          default: 1
        },
        {
          id: 'guildOnly',
          match: 'flag',
          flag: '--guild'
        }
      ]
    })
  }

  async exec ({ t, ct, client, guild, util, db }, { type, page, guildOnly }) {
    const parsedType = this.parseTypes(type)
    const ids = guildOnly && guild.members.map(member => member.id)
    const data = await db.users.ranking(parsedType, ids, 5, 5 * (page - 1))

    if (data.length < 5) {
      return util.send(ct('noPage'))
    }

    const width = 400
    const height = 350

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const template = await loadImage('src/assets/leaderboard/template.png')

    const users = await Promise.all(data.map(doc => (client.users.fetch(doc.id))))

    let index = 0

    for await (const user of users) {
      const avatar = await loadImage(user.dynamicAvatarURL('png', 64))
      ctx.drawImage(avatar, 61, 61 + (54 * index), 44, 44)
      index++
    }

    ctx.drawImage(template, 0, 0, width, height)

    ctx.font = '15px thebold'
    ctx.fillStyle = '#1cac50'

    for (const i in users) {
      const user = users[i]
      const username = `${user.username.slice(0, 10)}#${user.discriminator}`
      const value = this.getValue(data[i], type)

      const parsed = ct(`types.${type}`, { value })
      const position = 363 - ctx.measureText(parsed).width
      const espace = i * 54

      ctx.fillText(username, 109, 89 + espace)
      ctx.fillText(parsed, position, 89 + espace)
    }

    const attach = new MessageAttachment(canvas.toBuffer(), 'leaderboard.png')
    const parsed = t(`commons:${PLACES.includes(type) ? 'storages.' : ''}${type}`)

    util.send(`\\${trophy} ${ct('success', { type: parsed, page })}`, attach)
  }

  parseTypes (type) {
    if (PLACES.includes(type)) {
      return `${type}.storage`
    }

    if (type === 'fishs') {
      return 'statistics.rare'
    }

    return type
  }

  getValue (data, type) {
    if (PLACES.includes(type)) {
      return data[type].storage
    }

    if (type === 'fishs') {
      return data.statistics.rare || 0
    }

    return data[type].toLocaleString()
  }
}

module.exports = Leaderboard
