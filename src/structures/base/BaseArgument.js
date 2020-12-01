class BaseArgument {
  static parseOptions (opts) {
    return {
      match: opts?.match ?? 'phrase',
      flag: opts?.flag ?? [],
      default: opts?.default ?? null,
      otherwise: opts?.otherwise ?? null
    }
  }

  static parse (arg) {
    return arg
  }
}

module.exports = BaseArgument
