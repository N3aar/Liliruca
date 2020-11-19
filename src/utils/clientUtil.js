const { Permissions } = require('discord.js')

class ClientUtil {
  static getBotPermissions () {
    return Permissions.FLAGS.ADMINISTRATOR |
      Permissions.FLAGS.VIEW_CHANNEL |
      Permissions.FLAGS.SEND_MESSAGES |
      Permissions.FLAGS.EMBED_LINKS |
      Permissions.FLAGS.ATTACH_FILES |
      Permissions.FLAGS.READ_MESSAGE_HISTORY |
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS
  }

  static getBotInvite (clientId, permissions) {
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot`
  }
}

module.exports = ClientUtil
