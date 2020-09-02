const { Signale } = require('signale')

const LilirucaLogger = new Signale({
  types: {
    command: {
      badge: '💬',
      color: 'gray',
      label: 'command',
      logLevel: 'debug'
    }
  }
})

module.exports = LilirucaLogger
