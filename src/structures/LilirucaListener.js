const BaseModule = require('./base/BaseModule')
const createOptions = require('@utils/createOptions')

class LilirucaListener extends BaseModule {
  constructor (id, opts) {
    super(id, opts.category)
    const options = createOptions('LilirucaListener', opts)

    this.emitter = options.required('emitter')
    this.event = options.required('event')
    this.type = options.optional('type', 'on')
  }

  exec () {
    throw new Error(`${this.constructor.name} doesn't have a exec() method.`)
  }
}

module.exports = LilirucaListener
