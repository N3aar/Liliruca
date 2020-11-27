const BaseArgument = require('@structures/base/BaseArgument')

class OptionArgument extends BaseArgument {
  static parseOptions (opts) {
    return {
      ...super.parseOptions(opts),
      options: opts.options
    }
  }

  static exec (arg, _ctx, opts) {
    const { options } = opts
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
