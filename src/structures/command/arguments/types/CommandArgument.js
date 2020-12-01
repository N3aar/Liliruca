
const BaseArgument = require('@structures/base/BaseArgument')

class CommandArgument extends BaseArgument {
  static parseOptions (opts) {
    return super.parseOptions(opts)
  }

  static exec (arg, ctx) {
    return ctx.handler.findCommand(arg)
  }
}

module.exports = CommandArgument
