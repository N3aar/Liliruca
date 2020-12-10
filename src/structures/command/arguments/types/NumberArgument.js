const BaseArgument = require('@structures/base/BaseArgument')
const ArgumentError = require('../ArgumentError')

class NumberArgument extends BaseArgument {
  static parseOptions (opts) {
    return {
      ...super.parseOptions(opts),
      fixed: opts?.fixed ?? false,
      min: opts?.min ?? null,
      max: opts?.max ?? null,
      forceMin: opts?.forceMin ?? null,
      forceMax: opts?.forceMax ?? null
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

    if (opts.forceMin && number < opts.forceMin) {
      return opts.forceMin
    }

    if (opts.forceMax && number > opts.forceMax) {
      return opts.forceMax
    }

    return number
  }
}

module.exports = NumberArgument
