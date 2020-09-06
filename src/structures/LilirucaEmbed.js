const { MessageEmbed } = require('discord.js')
const { EMBED_COLORS } = require('@constants')

class LilirucaEmbed extends MessageEmbed {
  constructor (embedType = 'default') {
    const color = EMBED_COLORS[embedType]
    super({ color })
  }
}

module.exports = LilirucaEmbed
