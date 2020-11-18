const createOptions = require('@utils/createOptions')
const BaseModule = require('./base/BaseModule')

class LilirucaCommand extends BaseModule {
  constructor (name, opts) {
    super(name, opts.category)
    const options = createOptions('LilirucaCommand', opts)

    this.emoji = options.required('emoji')
    this.editable = options.optional('editable', true)
    this.args = options.optional('args', [])
    this.userPermissions = options.optional('userPermissions', [])
    this.clientPermissions = options.optional('clientPermissions', [])
    this.aliases = options.optional('aliases', [])
    this.category = options.optional('category', 'General')
    this.ownerOnly = options.optional('ownerOnly', false)
    this.cooldownTime = 0
  }

  preLoad (ctx) {
    if (this.ownerOnly && !this.client.config.owners.includes(ctx.author.id)) {
      return ctx.util.send('Este comando se encontra disponível apenas para meus donos.')
    }

    try {
      this.run(ctx)
    } catch (error) {
      console.error(error)
    }
  }

  exec () {
    throw new Error(`${this.constructor.name} doesn't have a exec() method.`)
  }
}

module.exports = LilirucaCommand
