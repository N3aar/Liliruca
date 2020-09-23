const { SEQUENCE_OF_SESSIONS, SEASONS_PERCENTAGE, PRODUCTION_LIMIT, RESOURCE_NAMES } = require('../Constants')

function getSeasonByMonth (month) {
  const parsed = month ? Math.min(Math.max(month, 1), 12) : (new Date().getMonth() + 1)
  return SEQUENCE_OF_SESSIONS[(parsed - 1) % 4]
}

function getPercentageFromSeason (value, place, month) {
  const season = getSeasonByMonth(month)
  const percentage = SEASONS_PERCENTAGE[season][place]
  return Math.floor(value * percentage)
}

function getStoragePrice (storage, firstValue, secondValue) {
  const second = secondValue - 1
  const calc = (firstValue + second) * (second - firstValue + 1) / 2
  return calc * storage
}

function getPriceResource (resource, amount) {
  const products = {
    [RESOURCE_NAMES.FOOD]: amount / 5,
    [RESOURCE_NAMES.FISH]: amount * 2,
    [RESOURCE_NAMES.METAL]: amount * 3
  }
  return products[resource]
}

function calculateProduction (collectedAt, level, generate, place) {
  if (!collectedAt || !level) {
    return 0
  }

  const ms = Date.now() - collectedAt
  const hours = (ms / (60000 * 60)) % 24
  const minutes = (ms / (1000 * 60)) % 60

  const productionLimit = PRODUCTION_LIMIT[place] + (level * 2)
  const timeHr = hours < productionLimit ? hours : productionLimit
  const calcHr = generate * timeHr

  const timeMt = timeHr + Number(`0.${minutes}`) <= productionLimit ? minutes : 0
  const calcMt = (generate / 60) * timeMt

  const producedSeason = getPercentageFromSeason(calcHr + calcMt, place)

  return Math.floor(producedSeason)
}

module.exports = {
  getSeasonByMonth,
  getPercentageFromSeason,
  getStoragePrice,
  getPriceResource,
  calculateProduction
}
