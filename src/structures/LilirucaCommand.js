const { createOptions } = require('@utils')

class LilirucaCommand {
  constructor (opts) {
    const options = createOptions('Command', opts)

    this.name = options.required('name')
    this.emoji = options.required('emoji')
    this.editable = options.optional('editable', true)
    this.args = options.optional('args', [])
    this.userPermissions = options.optional('userPermissions', [])
    this.clientPermissions = options.optional('clientPermissions', [])
    this.aliases = options.optional('aliases', [])
    this.category = options.optional('category', 'General')
    this.ownerOnly = options.optional('ownerOnly', false)
    this.cooldownTime = 0

    // TODO: seta o cliente no loader
    this.client = null
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

  run () {}
}

module.exports = LilirucaCommand
