const BaseModule = require('@structures/base/BaseModule')
const createOptions = require('@utils/createOptions')

class BaseArgument extends BaseModule {
  constructor (id, opts) {
    super(id, opts.category)
    const options = createOptions('BaseArgument', opts)

    this.match = options.optional('match', 'phrase')
    this.flag = options.optional('flag', [])
    this.unordered = options.optional('unordered', false)
    this.default = options.optional('default', null)
    this.otherwise = options.optional('otherwise', null)
  }

  exec (arg) {
    return arg
  }
}

module.exports = BaseArgument
