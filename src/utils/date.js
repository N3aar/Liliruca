const moment = require('moment')
const { getT } = require('./locales')

function parseDate (timestamp, language = 'pt-BR') {
  moment.locale(language)
  return moment(timestamp).format('LL')
}

function parseDuration (timestamp, t = 'pt-BR') {
  if (typeof t === 'string') t = getT(t)

  const monthTimestamp = 86400000 * 31
  if (timestamp > monthTimestamp) return t('common:longTime')

  const date = new Date(timestamp)
  const days = date.getDate() - 1
  const hours = date.getHours()
  const minutes = date.getMinutes()

  let dateString = ''
  if (days) dateString += `${days} ${t('common:date.days')} `
  if (hours) dateString += `${hours} ${t('common:date.hours')} `
  if (minutes) dateString += `${minutes} ${t('common:date.minutes')} `

  return dateString
}

module.exports = {
  parseDate,
  parseDuration
}
