const { CommandHandler, AkairoClient } = require('discord-akairo')
const path = require('path')

describe('Command Tests', () => {
  const client = new AkairoClient()
  const commandHandler = new CommandHandler(client, {
    automateCategories: true,
    directory: path.join(__dirname, '..', 'commands')
  })

  commandHandler.loadAll()
})
