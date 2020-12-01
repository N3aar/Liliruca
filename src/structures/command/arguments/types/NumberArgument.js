const BaseArgument = require('@structures/base/BaseArgument')
const ArgumentError = require('../ArgumentError')

class NumberArgument extends BaseArgument {
  static parseOptions (opts) {
    return {
      ...super.parseOptions(opts),
      fixed: opts?.fixed ?? false,
      min: opts?.min ?? null,
      max: opts?.min ?? null,
      forceMin: opts?.min ?? null,
      forceMax: opts?.min ?? null
    }
  }

  static exec (arg, ctx, opts) {
    const number = opts.fixed ? Number(arg) : parseInt(arg)

    if (isNaN(number)) {
      return null
    }

    if (opts.min && number < opts.min) {
      throw new ArgumentError(ctx.t('errors:min', { count: opts.min }))
    }

    if (opts.max && number > opts.max) {
      throw new ArgumentError(ctx.t('errors:max', { count: opts.max }))
    }

    if (opts.forceMax) {
      return Math.min(number, opts.forceMax)
    }

    if (opts.forceMin) {
      return Math.max(number, opts.forceMin)
    }

    return number
  }
}

module.exports = NumberArgument
