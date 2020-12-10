class DiscordUtil {
  static createAttachment (file, name) {
    return {
      file,
      name
    }
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
