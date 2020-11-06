class LilirucaCollection {
  /**
   * Get entity
   *
   * @abstract
   * @param {string} id
   * @param {string} key
   * @param {any} [defaultValue]
   * @returns {any}
   */
  get (id, key, defaultValue) {
    throw new Error(`${this.constructor.name} doesn't have a get() method.`)
  }

  /**
   * Update one value
   *
   * @abstract
   * @param {string} id
   * @param {string} key
   * @param {any} [value]
   * @returns {any}
   */
  updateOne (id, key, value) {
    throw new Error(`${this.constructor.name} doesn't have a updateOne() method.`)
  }

  /**
   * Delete the entity
   *
   * @abstract
   * @param {string} id
   * @param {string} key
   * @returns {any}
   */
  delete (id, key) {
    throw new Error(`${this.constructor.name} doesn't have a delete() method.`)
  }
}

module.exports = LilirucaCollection
