const QuickLRU = require('quick-lru')

class LilirucaCollection {
  /**
   * @param {number} maxSize Quantidade máxima de entidades que será armazenada em cache.
   */
  constructor (maxSize = 100) {
    this.items = new QuickLRU({ maxSize })
  }

  /**
   * Procura um valor.
   *
   * @abstract
   * @param {string} id - ID da entidade.
   * @param {string} key - Chave para buscar.
   * @param {any} [defaultValue] - Valor padrão caso não exista.
   * @returns {any}
   */
  get (id, key, defaultValue) {
    throw new Error(`método get não foi definido em ${this.constructor.name}.`)
  }

  /**
   * Define um valor.
   *
   * @abstract
   * @param {string} id - ID da entidade.
   * @param {string} key - Chave para buscar.
   * @param {any} [value] - Valor da entidade.
   * @returns {any}
   */
  set (id, key, value) {
    throw new Error(`método set não foi definido em ${this.constructor.name}.`)
  }

  /**
   * Deleta uma Entidade.
   *
   * @abstract
   * @param {string} id - ID of entry.
   * @param {string} key - The key to delete.
   * @returns {any}
   */
  delete (id, key) {
    throw new Error(`método delete não foi definido em ${this.constructor.name}.`)
  }
}

module.exports = LilirucaCollection
