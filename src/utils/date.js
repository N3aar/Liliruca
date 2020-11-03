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

function displayDate (time, language, format = 'L') {
  return dayjs(time).locale(language).format(format)
}

function getDuration (timestamp) {
  const date = dayjs.duration(timestamp)
  return {
    days: Math.floor(date.asDays()),
    hours: Math.floor(date.hours()),
    minutes: Math.floor(date.minutes())
  }
}

loadAllPlugins()

module.exports = {
  parseDuration,
  displayDate,
  getDuration
}
