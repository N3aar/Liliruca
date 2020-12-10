const BaseArgument = require('@structures/base/BaseArgument')
const ArgumentError = require('../ArgumentError')
const USER_ID_REGEX = /(\d{17,19})/

class MemberArgument extends BaseArgument {
  static parseOptions (opts) {
    return {
      ...super.parseOptions(opts),
      onlyHuman: opts?.onlyHuman ?? true
    }
  }

  static exec (arg, ctx, opts) {
    const memberId = USER_ID_REGEX.exec(arg)?.[0]
    const member = ctx.guild.members.get(memberId)

    if (!member) {
      return null
    }

    if (opts.onlyHuman && member?.bot) {
      throw new ArgumentError(ctx.t('errors:nothuman'))
    }

    return member
  }
}

module.exports = MemberArgument
