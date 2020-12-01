const BaseArgument = require('@structures/base/BaseArgument')
const { PLACES_ALIASES } = require('@constants/constant')

class PlaceArgument extends BaseArgument {
  static parseOptions (opts) {
    return super.parseOptions(opts)
  }

  static exec (arg) {
    const resolved = arg.toLowerCase()

    for (const place in PLACES_ALIASES) {
      if (PLACES_ALIASES[place].includes(resolved)) {
        return place
      }
    }
  }
}

module.exports = PlaceArgument
