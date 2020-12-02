class DiscordUtil {
  static createAttachment (file, name) {
    return {
      file,
      name
    }
  }
}

module.exports = DiscordUtil
