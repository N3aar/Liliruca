const { CommandHandler, AkairoClient } = require('discord-akairo')
const path = require('path')

describe('Command Tests', async () => {
  const client = new AkairoClient()
  const commandHandler = new CommandHandler(client, {
    automateCategories: true,
    directory: path.join(__dirname, '..', 'commands')
  })

  await commandHandler.loadAll()

  // const categories = commandHandler.categories
  const commands = commandHandler.modules.array()
  const checkUniqueArr = arr => arr.some((v, i) => arr.indexOf(v) !== i)

  test('test if have emojis duplicated', () => {
    expect(checkUniqueArr(commands.map(c => c.emoji))).toBe(true)
  })
})
