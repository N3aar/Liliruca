const BaseArgument = require('../BaseArgument')

// TODO: add opções do tipo: maxLength, minLength etc
class TextArgument extends BaseArgument {
  constructor (opts) {
    super('text', opts)
  }
}

module.exports = TextArgument
