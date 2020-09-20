const LilirucaCommand = require('@structures/LilirucaCommand')
const { languages } = require('@utils/locales')
const { EMOJIS, DEFAULT_LANGUAGE } = require('@constants')

class SetLanguage extends LilirucaCommand {
  constructor () {
    super('setlanguage', {
      aliases: ['language', 'lang', 'setlang'],
      emoji: EMOJIS.books,
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
    const lang = language || DEFAULT_LANGUAGE

    await db.guilds.set(guild.id, lang, 'language')

    const t = locales.getT(lang)
    const success = `commands:setlanguage.${language ? 'changedLanguage' : 'resetLanguage'}`

    util.send(t(success, { language: lang }))
  }
}

module.exports = SetLanguage
