const LilirucaEmbed = require('../LilirucaEmbed')
const LilirucaAttachment = require('../LilirucaAttachment')

class CommandUtil {
  constructor (client, message) {
    this.client = client
    this.channelId = message.channel.id
    this.reference = {
      channel_id: this.channelId,
      guild_id: message.guildID,
      message_id: message.id
    }
    this.createdAt = Date.now()
    this.sentMessageId = null
  }

  async send (content, opts) {
    const options = CommandUtil.parseOptions(content, opts, this.reference)

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
    this.sentMessageId = newMsg.id
    return newMsg
  }

  edit (content, opts) {
    return this.send(content, opts)
  }

  static parseOptions (content, options, reference) {
    if (!options && typeof content === 'object' && !Array.isArray(content)) {
      options = content
      content = undefined
    }

    if (!options) {
      options = {}
    } else if (options instanceof LilirucaEmbed) {
      return { content, embed: options, message_reference: reference }
    } else if (options instanceof LilirucaAttachment) {
      return { content, files: [options], message_reference: reference }
    }

    return { content, ...options, message_reference: reference }
  }
}

module.exports = CommandUtil
