const BaseHandler = require('./base/BaseHandler')
const LilirucaCommand = require('./LilirucaCommand')

class CommandHandler extends BaseHandler {
  constructor (client, directory, automateCategories = true) {
    super(client, {
      directory,
      classToHandle: LilirucaCommand,
      automateCategories
    })
  }
}

module.exports = CommandHandler
