const { MessageEmbed } = require('discord.js')
const { EMBED_COLORS } = require('@constants')

const colors = {
  error: EMBED_COLORS.ERROR,
  warn: EMBED_COLORS.EMBED_COLOR,
  default: EMBED_COLORS.DEFAULT
}

class LilirucaEmbed extends MessageEmbed {
  constructor (embedType = 'default') {
    const color = colors[embedType]
    super({ color })
  }
}

module.exports = LilirucaEmbed
