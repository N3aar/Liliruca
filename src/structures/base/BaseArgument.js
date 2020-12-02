class BaseArgument {
  static parseOptions (opts) {
    return {
      match: opts?.match ?? 'phrase',
      flags: opts?.flags ?? [],
      default: opts?.default ?? null,
      otherwise: opts?.otherwise ?? null
    }
  }

  static parse (arg) {
    return arg
  }
}

module.exports = BaseArgument
