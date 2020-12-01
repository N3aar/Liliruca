
const BaseArgument = require('@structures/base/BaseArgument')

class CommandArgument extends BaseArgument {
  static exec (arg, ctx) {
    return ctx.handler.findCommand(arg)
  }
}

module.exports = CommandArgument
