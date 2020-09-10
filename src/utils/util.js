const { SEQUENCE_OF_SESSIONS, SEASONS_PERCENTAGE } = require('../Constants')

function getSeasonByMonth (month) {
  const parsed = month ? Math.min(Math.max(month, 1), 12) : (new Date().getMonth() + 1)
  return SEQUENCE_OF_SESSIONS[(parsed - 1) % 4]
}

function getPercentageFromSeason (value, place, month) {
  const season = getSeasonByMonth(month)
  return value * SEASONS_PERCENTAGE[season][place]
}

function getStoragePrice (storage, firstValue, secondValue) {
  const second = secondValue - 1
  const calc = (firstValue + second) * (second - firstValue + 1) / 2
  return calc * storage
}

module.exports = {
  getSeasonByMonth,
  getPercentageFromSeason,
  getStoragePrice
}
