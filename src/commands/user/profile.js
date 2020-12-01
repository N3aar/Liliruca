const { createCanvas, loadImage } = require('canvas')
const { MessageAttachment } = require('discord.js')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { picture } = require('@constants/emojis')

class Profile extends LilirucaCommand {
  constructor () {
    super('profile', {
      aliases: ['pf', 'perfil'],
      emoji: picture,
      editable: false,
      typing: true,
      clientPermissions: 'attachFiles',
      args: [
        {
          id: 'member',
          type: 'member',
          default: message => message.member
        }
      ]
    })
  }

  async exec ({ ct, db, util }, { member }) {
    const data = await db.users.ensure(member.id)
    const width = 590
    const height = 230

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const name = member.displayName
    const avatarUrl = member.user.dynamicAvatarURL('png', 256)
    const bkg = data.background || 1

    const folder = 'src/assets/profile/'
    const template = await loadImage(folder + 'template.png')
    const nameIcon = await loadImage(folder + 'name-icon.png')
    const energyIcon = await loadImage(folder + 'energy-icon.png')
    const background = await loadImage(folder + `backgrounds/${bkg}.png`)
    const avatar = await loadImage(avatarUrl)

    ctx.drawImage(background, 0, 0, width, height)
    ctx.drawImage(avatar, 23, 31, 169, 169)
    ctx.drawImage(template, 0, 0, width, height)

    const barWidth = 333
    const energyBar = barWidth / 100

    ctx.fillStyle = '#349f2f'
    ctx.fillRect(219.88, 152.33, energyBar * data.energy, 30.86)

    ctx.fillStyle = '#ffffff'
    ctx.font = '27.98px candara-light'
    ctx.fillText(name, 228.15, 78.13)

    ctx.font = '18.81px segoe-ui-light'
    ctx.fillText(`$${data.money.toLocaleString()}`, 228.15, 129.27)
    ctx.fillText(`${data.lilistars.toLocaleString()} Lilistars`, 417.19, 129.27)

    const energy = `${data.energy}/100`
    const position = 220 + ((barWidth / 2) - (ctx.measureText(energy).width / 2))

    ctx.fillText(energy, position, 175.33)

    ctx.drawImage(nameIcon, 515, 55, nameIcon.width, nameIcon.height)
    ctx.drawImage(energyIcon, 544, 162, energyIcon.width, energyIcon.height)

    const profile = new MessageAttachment(canvas.toBuffer(), 'profile.png')

    util.send(`\\${picture} ${ct('success', { name })}`, profile)
  }
}

module.exports = Profile
