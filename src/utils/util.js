const { getDuration } = require('./date')
const { SEASONS, SEASONS_PERCENTAGE, WEATHERS, WEATHER_PERCENTAGE, PRODUCTION_LIMIT, RESOURCE_NAMES } = require('./constants/constant')

class Util {
  static getSeasonByMonth (month) {
    const parsed = !isNaN(month) ? Math.min(Math.max(month, 1), 12) : (new Date().getMonth() + 1)
    return SEASONS[(parsed - 1) % 4]
  }

  static getPercentageFromSeason (value, place, month) {
    const season = Util.getSeasonByMonth(month)
    const percentage = SEASONS_PERCENTAGE[season][place]
    return Math.floor(value * percentage)
  }

  static getWeatherByDay (day, month, year) {
    const date = new Date()
    const parsedYear = year || date.getFullYear()
    const parsedMonth = month || (date.getMonth() + 2)
    const parsedDay = !isNaN(day) ? Math.min(Math.max(day, 1), 31) : date.getDate()
    const weather = (parsedYear - parsedDay) % parsedMonth
    return WEATHERS[weather % 4]
  }

  static getPercentageFromWeather (value, place, day) {
    const current = Util.getWeatherByDay(day)
    const weathers = WEATHER_PERCENTAGE[current]
    const percentage = weathers && weathers[place]
    return percentage ? Math.floor(value * (percentage)) : value
  }

  static getStoragePrice (storage, firstValue, secondValue) {
    const second = secondValue - 1
    const calc = (firstValue + second) * (second - firstValue + 1) / 2
    return calc * storage
  }

  static getPriceResource (resource, amount) {
    const products = {
      [RESOURCE_NAMES.FOOD]: amount / 5,
      [RESOURCE_NAMES.FISH]: amount * 2,
      [RESOURCE_NAMES.METAL]: amount * 3
    }
    return Math.floor(products[resource])
  }

  static capitalize (str) {
    return str[0].toUpperCase() + str.slice(1)
  }

  static random (max, min = 0, inclusive = false) {
    return Math.floor(Math.random() * (max - min + inclusive)) + min
  }

  static randomChances (chances) {
    const chance = Util.random(100, 1, true)
    for (const name in chances) {
      const values = chances[name]
      const min = values.min || 1
      const max = values.max || 100

      if (chance >= min && chance <= max) {
        return name
      }
    }
  }

  static calculateProduction (data, generate, place, booster) {
    if (!data.collectedAt) {
      return { production: 0, boosted: 0 }
    }

    const productionLimit = PRODUCTION_LIMIT[place] + (data[place].level * 2)
    const parsed = productionLimit * 60 * 60 * 1000
    const time = getDuration(Math.min(Date.now() - data.collectedAt, parsed))

    const produced = (time.hours * generate) + (time.minutes * (generate / 60))
    const percentage = booster && Util.random(booster.max, booster.min, true)
    const boosted = percentage && produced + (produced * percentage / 100)
    const season = Util.getPercentageFromSeason(boosted || produced, place)

    return {
      production: Util.getPercentageFromWeather(season, place),
      boosted: percentage
    }
  }
}

module.exports = Util
