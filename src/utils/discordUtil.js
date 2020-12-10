class DiscordUtil {
  static createAttachment (file, name) {
    return {
      file,
      name
    }
  }

  static getNickname (member) {
    return member && (member.nick || member.username)
  }

  static normalizeMention (member) {
    return member && `<@${member.id}>`
  }

  static async fetchUser (client, userId) {
    if (client.users.has(userId)) {
      return client.users.get(userId)
    }

    const user = await client.getRESTUser(userId)
    client.users.set(userId, user)

    return user
  }
}

module.exports = DiscordUtil
