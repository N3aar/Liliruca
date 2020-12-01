const LilirucaCommand = require('@structures/LilirucaCommand')
const { books } = require('@constants/emojis')

class SetLanguage extends LilirucaCommand {
  constructor () {
    super('setlanguage', {
      aliases: ['language', 'lang', 'setlang'],
      emoji: books,
      userPermissions: 'manageGuild',
      args: [
        {
          id: 'language',
          type: 'option',
          options: ({ client }) => client.locales.languages,
          otherwise: message => message.ct('error', { languages: message.client.locales.languages.map(l => `\`${l}\``).join(', ') })
        }
      ]
    })
  }

  async exec ({ client, db, guild, util }, { language }) {
    await db.guilds.updateOne(guild.id, 'language', language)
    const t = client.locales.getT(language)
    util.send(`\\💬 ${t('commands:setlanguage.success', { language })}`)
  }
}

module.exports = SetLanguage
