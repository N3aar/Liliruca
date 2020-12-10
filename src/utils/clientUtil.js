const { Constants } = require('eris')

class ClientUtil {
  static getBotPermissions () {
    return Constants.Permissions.administrator |
      Constants.Permissions.readMessages |
      Constants.Permissions.sendMessages |
      Constants.Permissions.embedLinks |
      Constants.Permissions.attachFiles |
      Constants.Permissions.readMessageHistory |
      Constants.Permissions.externalEmojis
  }

  static getBotInvite (clientId, permissions) {
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot`
  }
}

module.exports = ClientUtil
