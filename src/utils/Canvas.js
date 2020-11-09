const { PLACES } = require('@constants')

let createCanvas, loadImage
try {
  const Canvas = require('canvas')
  createCanvas = Canvas.createCanvas
  loadImage = Canvas.loadImage
} catch {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('required canvas module is installed')
  }
}

function getValue (data, type) {
  if (PLACES.includes(type)) {
    return data[type].storage
  }

  if (type === 'fishs') {
    return data.raresFishs.total
  }

  return data[type]
}

async function drawLeaderboard (data, type, ct, users) {
  const width = 400
  const height = 350

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const template = await loadImage('src/assets/leaderboard/template.png')

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
    const value = getValue(data[index], type)

    const parsed = ct(`types.${type}`, { value })
    const position = 363 - ctx.measureText(parsed).width
    const espace = index * 54

    ctx.fillText(username, 109, 89 + espace)
    ctx.fillText(parsed, position, 89 + espace)

    index++
  }

  return canvas.toBuffer()
}

async function drawProfile (data, member) {
  const width = 590
  const height = 230

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const avatarUrl = member.user.displayAvatarURL({ format: 'png', size: 256 })
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
  ctx.fillText(member.displayName, 228.15, 78.13)

  ctx.font = '18.81px segoe-ui-light'
  ctx.fillText(`$${data.money.toLocaleString()}`, 228.15, 129.27)
  ctx.fillText(`${data.lilistars.toLocaleString()} Lilistars`, 417.19, 129.27)

  const energy = `${data.energy}/100`
  const position = 220 + ((barWidth / 2) - (ctx.measureText(energy).width / 2))

  ctx.fillText(energy, position, 175.33)

  ctx.drawImage(nameIcon, 515, 55, nameIcon.width, nameIcon.height)
  ctx.drawImage(energyIcon, 544, 162, energyIcon.width, energyIcon.height)

  return canvas.toBuffer()
}

module.exports = { drawLeaderboard, drawProfile }
