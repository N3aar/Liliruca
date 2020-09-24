const dayjs = require('dayjs')

// Locales
require('dayjs/locale/en')
require('dayjs/locale/pt-br')

// Plugins
function loadAllPlugins () {
  const plugins = [
    'duration',
    'relativeTime',
    'localizedFormat'
  ]

  for (const name of plugins) {
    const plugin = require(`dayjs/plugin/${name}`)
    dayjs.extend(plugin)
  }
}

function parseDuration (time, language) {
  return dayjs.duration(time).locale(language).humanize()
}

function displayDate (time, language) {
  return dayjs(time).locale(language).format('L')
}

function getDuration (timestamp) {
  const date = dayjs.duration(timestamp)
  return {
    days: date.days(),
    hours: date.hours(),
    minutes: date.minutes()
  }
}

loadAllPlugins()

module.exports = {
  parseDuration,
  displayDate,
  getDuration
}
