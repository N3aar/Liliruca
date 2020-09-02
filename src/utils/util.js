const { SEQUENCE_OF_SESSIONS, SEASON_NAMES, PLACE_NAMES } = require('../Constants')

function getSeasonByMonth(month) {
  const parsed = month ? Math.min(Math.max(month, 1), 12) : (new Date().getMonth() + 1)
  return SEQUENCE_OF_SESSIONS[(parsed - 1) % 4]
}

function getPercentageFromSeason (value, place, month) {
  const season = getSeasonByMonth(month)

  switch (season) {
    case SEASON_NAMES.SPRING:
      switch (place) {
        case PLACE_NAMES.FARM: return value * 0.9
        case PLACE_NAMES.MINING: return value * 1.05
        case PLACE_NAMES.FISHING: return value * 0.85
      }
      break
    case SEASON_NAMES.SUMMER:
      switch (place) {
        case PLACE_NAMES.FARM: return value * 1.15
        case PLACE_NAMES.MINING: return value * 0.8
        case PLACE_NAMES.FISHING: return value * 1.2
      }
      break
    case SEASON_NAMES.AUTUMN:
      switch (place) {
        case PLACE_NAMES.FARM: return value * 1.2
        case PLACE_NAMES.MINING: return value * 0.85
        case PLACE_NAMES.FISHING: return value * 1.15
      }
      break
    case SEASON_NAMES.WINTER:
      switch (place) {
        case PLACE_NAMES.FARM: return value * 0.75
        case PLACE_NAMES.MINING: return value * 1.3
        case PLACE_NAMES.FISHING: return value * 0.8
      }
  }
}

module.exports = {
  getSeasonByMonth,
  getPercentageFromSeason,
}
