const BaseArgument = require('@structures/base/BaseArgument')

const Fn = (fn, ...args) => typeof fn === 'function' ? fn(...args) : fn
class OptionArgument extends BaseArgument {
  static parseOptions (opts) {
    return {
      ...super.parseOptions(opts),
      options: opts.options
    }
  }

  static async exec (arg, ctx, opts) {
    const options = await Fn(opts.options, arg, ctx)

    if (Array.isArray(options)) {
      for (const entry of options) {
        if (Array.isArray(entry)) {
          if (entry.some(t => t.toLowerCase() === arg.toLowerCase())) {
            return entry[0]
          }
        } else if (entry.toLowerCase() === arg.toLowerCase()) {
          return entry
        }
      }
    }
    return null
  }
}

module.exports = OptionArgument
