const LilirucaEmbed = require('./LilirucaEmbed')
const LilirucaAttachment = require('./LilirucaAttachment')

// TODO: fazer o edit, comandos como ping usa
class CommandUtil {
  constructor (client, messageId, channelId) {
    this.client = client
    this.channelId = channelId
    this.messageId = messageId
    this.lastUsedAt = new Date()
    this.sentMessageId = null
  }

  async send (content, opts) {
    this.lastUsedAt = new Date()

    const options = CommandUtil.parseOptions(content, opts)

    if (this.sentMessageId) {
      try {
        return await this.client.editMessage(this.channelId, this.sentMessageId, options)
      } catch {
        return this.createMessage(options)
      }
    }
    return this.createMessage(options)
  }

  async createMessage (options) {
    const newMsg = await this.client.createMessage(this.channelId, options)
    this.sentMessageId = newMsg
    return newMsg
  }

  static parseOptions (content, options) {
    if (!options && typeof content === 'object' && !Array.isArray(content)) {
      options = content
      content = undefined
    }

    if (!options) {
      options = {}
    } else if (options instanceof LilirucaEmbed) {
      return { content, embed: options }
    } else if (options instanceof LilirucaAttachment) {
      return { content, files: [options] }
    }

    return { content, ...options }
  }
}

module.exports = CommandUtil
