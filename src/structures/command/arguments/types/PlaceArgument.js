const { PLACE_NAMES } = require('@constants/constant')
const OptionArgument = require('./OptionArgument')

class PlaceArgument extends OptionArgument {
  static parseOptions (opts) {
    return {
      ...super.parseOptions(opts),
      options: [
        [PLACE_NAMES.FARM, 'farm', 'fm', 'fazenda'],
        [PLACE_NAMES.FISHING, 'fishing', 'fs', 'pescaria'],
        [PLACE_NAMES.MINING, 'mining', 'mn', 'mineradora']
      ]
    }
  }
}

module.exports = PlaceArgument
