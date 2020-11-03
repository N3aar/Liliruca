const LilirucaCommand = require('@structures/LilirucaCommand')
const { languages } = require('@utils/locales')
const { EMOJIS: { books } } = require('@constants')

class SetLanguage extends LilirucaCommand {
  constructor () {
    super('setlanguage', {
      aliases: ['language', 'lang', 'setlang'],
      emoji: books,
      userPermissions: 'MANAGE_GUILD',
      editable: true,
      args: [
        {
          id: 'language',
          type: languages,
          otherwise: message => message.ct('error', { languages: languages.map(l => `\`${l}\``).join(', ') })
        }
      ]
    })
  }

  async exec ({ util, db, guild, locales }, { language }) {
    await db.guilds.updateOne(guild.id, language, 'language')
    const t = locales.getT(language)
    util.send(`\\💬 ${t('commands:setlanguage.success', { language })}`)
  }
}

module.exports = SetLanguage
