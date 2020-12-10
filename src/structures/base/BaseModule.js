class BaseModule {
  constructor (id, category) {
    this.id = id
    this.category = category || 'General'
    this.filepath = null
    this.client = null
    this.handler = null
  }
}

module.exports = BaseModule
