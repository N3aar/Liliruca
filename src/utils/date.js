const dayjs = require('dayjs')

require('dayjs/locale/en')
require('dayjs/locale/pt-br')

class FormatDate {
  static parseDuration (time, language) {
    return dayjs.duration(time).locale(language).humanize()
  }

  static displayDate (time, language, format = 'L') {
    return dayjs(time).locale(language).format(format)
  }

  static getDuration (timestamp) {
    const date = dayjs.duration(timestamp)
    return {
      hours: Math.floor(date.asHours()),
      minutes: Math.floor(date.minutes())
    }
  }
}

// Load Plugins
(() => {
  const plugins = [
    'duration',
    'relativeTime',
    'localizedFormat'
  ]

  for (const name of plugins) {
    const plugin = require(`dayjs/plugin/${name}`)
    dayjs.extend(plugin)
  }
})()

module.exports = FormatDate
