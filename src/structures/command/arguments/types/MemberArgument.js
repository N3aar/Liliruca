const BaseArgument = require('@structures/base/BaseArgument')
const ArgumentError = require('../ArgumentError')
const getid = /(\\d{17,19})/

class MemberArgument extends BaseArgument {
  static parseOptions (opts) {
    return {
      ...super.parseOptions(opts),
      onlyHuman: opts?.onlyHuman ?? true
    }
  }

  static exec (arg, ctx, opts) {
    const member = ctx.guild.members.get(arg.match(getid))

    if (opts.onlyHuman && member?.bot) {
      throw new ArgumentError(ctx.t('errors:nothuman'))
    }

    return member
  }
}

module.exports = MemberArgument
