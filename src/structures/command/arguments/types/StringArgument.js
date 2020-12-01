const BaseArgument = require('@structures/base/BaseArgument')
const ArgumentError = require('../ArgumentError')

class StringArgument extends BaseArgument {
  static parseOptions (opts) {
    return {
      ...super.parseOptions(opts),
      minLength: opts?.minLength ?? null,
      maxLength: opts?.minLength ?? null,
      lowercase: !!opts?.lowercase,
      uppercase: !!opts?.uppercase
    }
  }

  static exec (arg, ctx, opts) {
    if (opts.minLength && arg.length < opts.minLength) {
      throw new ArgumentError(ctx.t('errors:minlength', { count: opts.minLength }))
    }

    if (opts.maxLength && arg.length > opts.maxLength) {
      throw new ArgumentError(ctx.t('errors:maxLength', { count: opts.maxLength }))
    }

    if (opts.lowercase) {
      return arg.toLowerCase()
    }

    if (opts.uppercase) {
      return arg.toUpperCase()
    }

    return arg
  }
}

module.exports = StringArgument
