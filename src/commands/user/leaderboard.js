const { MessageAttachment } = require('discord.js')
const { Argument } = require('discord-akairo')
const { createCanvas, loadImage } = require('canvas')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { PLACES, LEADERBOARD_TYPES, EMOJIS: { trophy } } = require('@constants')

class Leaderboard extends LilirucaCommand {
  constructor () {
    super('leaderboard', {
      aliases: ['lb', 'ranking', 'rank'],
      emoji: trophy,
      editable: true,
      typing: true,
      clientPermissions: 'ATTACH_FILES',
      args: [
        {
          id: 'type',
          type: Argument.union(LEADERBOARD_TYPES, 'place'),
          otherwise: message => message.ct('error', { types: LEADERBOARD_TYPES.join(' | ') })
        },
        {
          id: 'page',
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
    const ids = guildOnly && guild.members.cache.map(member => member.id)
    const data = await db.users.ranking(type, ids, 5, 5 * (page - 1))

    if (data.length < 5) {
      return util.send(ct('noPage'))
    }

    const width = 400
    const height = 350

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const template = await loadImage('src/assets/leaderboard/template.png')

    const defaultUser = {
      username: 'xxxx',
      discriminator: '0000',
      defaultAvatar: await loadImage(client.user.displayAvatarURL({ format: 'png', size: 64 }))
    }

    const users = data.map(doc => client.users.cache.get(doc.id) || defaultUser)

    let index = 0

    for await (const user of users) {
      const avatar = user.defaultAvatar || await loadImage(user.displayAvatarURL({ format: 'png', size: 64 }))
      ctx.drawImage(avatar, 61, 61 + (54 * index), 44, 44)
      index++
    }

    ctx.drawImage(template, 0, 0, width, height)

    ctx.font = '15px thebold'
    ctx.fillStyle = '#1cac50'
    index = 0

    for (const user of users) {
      const username = `${user.username.slice(0, 10)}#${user.discriminator}`
      const value = this.getValue(data[index], type)

      const parsed = ct(`types.${type}`, { value })
      const position = 363 - ctx.measureText(parsed).width
      const espace = index * 54

      ctx.fillText(username, 109, 89 + espace)
      ctx.fillText(parsed, position, 89 + espace)

      index++
    }

    const attach = new MessageAttachment(canvas.toBuffer(), 'leaderboard.png')
    const parsed = t(`commons:${PLACES.includes(type) ? 'storages.' : ''}${type}`)

    util.send(`\\🏆 ${ct('success', { type: parsed, page })}`, attach)
  }

  getValue (data, type) {
    if (PLACES.includes(type)) {
      return data[type].storage
    }

    if (type === 'fishs') {
      return data.fishing.rares.total
    }

    return data[type]
  }
}

module.exports = Leaderboard
