const i18n = require('i18next')
const logger = require('@utils/logger')
const { readdirSync } = require('fs')
const Backend = require('i18next-node-fs-backend')

class Locales {
/**
 * Carrega todas as traduções.
 */
  static loadAll () {
    return i18n.use(Backend).init({
      ns: ['commands', 'errors', 'commons', 'categories', 'permissions', 'parameters'],
      preload: readdirSync('src/locales'),
      fallbackLng: 'pt-BR',
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

  /**
   * @param {string} language A lingua que você quer as traduções.
   * @param {string} [ns] Namespace pra facilitar as buscas.
   */
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
