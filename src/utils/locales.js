const i18n = require('i18next')
const Backend = require('i18next-node-fs-backend')
const { readdirSync } = require('fs')
const logger = require('@utils/logger')
const { DEFAULT_LANGUAGE } = require('@constants')

class Locales {
  static loadAll () {
    return i18n.use(Backend).init({
      ns: ['commands', 'errors', 'commons', 'categories', 'permissions'],
      preload: readdirSync('src/locales'),
      fallbackLng: DEFAULT_LANGUAGE,
      lowerCaseLng: true,
      defaultNS: 'commands',
      backend: {
        loadPath: 'src/locales/{{lng}}/{{ns}}.json'
      },
      interpolation: {
        escapeValue: false
      },
      returnEmptyString: false
    }, () => {
      logger.success('All languages loaded: ', Object.keys(i18n.store.data))
    })
  }

  static getT (language, ns) {
    return i18n.getFixedT(language, ns)
  }

  static get languages () {
    return Object.keys(i18n.store.data)
  }

  static exists (str) {
    return i18n.exists(str)
  }
}

module.exports = Locales
