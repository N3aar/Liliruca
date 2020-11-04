const { getDuration } = require('./date')
const { SEASONS, SEASONS_PERCENTAGE, WEATHERS, WEATHER_PERCENTAGE, PRODUCTION_LIMIT, RESOURCE_NAMES } = require('../Constants')

function getSeasonByMonth (month) {
  const parsed = !isNaN(month) ? Math.min(Math.max(month, 1), 12) : (new Date().getMonth() + 1)
  return SEASONS[(parsed - 1) % 4]
}

function getPercentageFromSeason (value, place, month) {
  const season = getSeasonByMonth(month)
  const percentage = SEASONS_PERCENTAGE[season][place]
  return Math.floor(value * percentage)
}

function getWeatherByDay (day, month, year) {
  const date = new Date()
  const parsed = !isNaN(day) ? Math.min(Math.max(day, 1), 31) : date.getDate()
  const weather = ((year || date.getFullYear()) - parsed) % (month || (date.getMonth() + 2))
  return WEATHERS[weather % 4]
}

function getPercentageFromWeather (value, place, day) {
  const current = getWeatherByDay(day)
  const weathers = WEATHER_PERCENTAGE[current]
  const percentage = weathers && weathers[place]
  return percentage ? Math.floor(value * (percentage)) : value
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
  return Math.floor(products[resource])
}

function random (max, min = 0, inclusive = false) {
  return Math.floor(Math.random() * (max - min + (inclusive ? 1 : 0))) + min
}

function randomChances (chances) {
  const chance = random(100, 1, true)
  for (const name in chances) {
    const values = chances[name]
    if (chance >= (values.min || 1) && chance <= (values.max || 100)) {
      return name
    }
  }
}

function calculateProduction (data, generate, place, booster) {
  if (!data.collectedAt) {
    return 0
  }

  const time = getDuration(Date.now() - data.collectedAt)

  time.hours += time.days * 24

  const productionLimit = PRODUCTION_LIMIT[place] + (data[place].level * 2)
  const timeHr = time.hours < productionLimit ? time.hours : productionLimit
  const timeMt = timeHr + (time.minutes / 100) <= productionLimit ? time.minutes : 0
  const produced = (generate * timeHr) + ((generate / 60) * timeMt)

  const percentage = booster && random(booster.item.max, booster.item.min, true)
  const boosted = percentage && produced + (produced * percentage / 100)
  const season = getPercentageFromSeason(boosted || produced, place)

  return {
    production: getPercentageFromWeather(season),
    boosted: percentage
  }
}

function findCategory ({ client, t }, phrase) {
  if (!phrase) {
    return null
  }

  let i = 1
  const arg = phrase.toLowerCase()
  const number = Number(phrase)

  return client.categories.find(category => {
    if (number === i || category.id === arg) {
      return true
    }

    const categoryName = t(`categories:${category.id}`).toLowerCase()
    if (categoryName === arg) {
      return true
    }

    i++
    return false
  })
}

function capitalize (str) {
  return str[0].toUpperCase() + str.slice(1)
}

module.exports = {
  capitalize,
  getSeasonByMonth,
  getPercentageFromSeason,
  getWeatherByDay,
  getPercentageFromWeather,
  getStoragePrice,
  getPriceResource,
  calculateProduction,
  findCategory,
  randomChances,
  random
}
