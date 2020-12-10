const createOptions = require('@utils/createOptions')
const BaseModule = require('./base/BaseModule')

class LilirucaCommand extends BaseModule {
  constructor (name, opts) {
    super(name, opts.category)
    const options = createOptions('LilirucaCommand', opts)

    this.emoji = options.required('emoji')
    this.editable = options.optional('editable', true)
    this.typing = options.optional('typing')
    this.args = options.optional('args', [])
    this.flags = options.optional('flags', [])
    this.userPermissions = options.optional('userPermissions')
    this.clientPermissions = options.optional('clientPermissions')
    this.aliases = options.optional('aliases', [])
    this.category = options.optional('category', 'General')
    this.ownerOnly = options.optional('ownerOnly', false)
    this.cooldownTime = 0
  }

  exec () {
    throw new Error(`${this.constructor.name} doesn't have a exec() method.`)
  }
}

module.exports = LilirucaCommand
