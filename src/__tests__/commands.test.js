const CommandHandler = require('../structures/command/CommandHandler')
const ArgumentRunner = require('../structures/command/arguments/ArgumentRunner')
const LilirucaClient = require('../client/LilirucaClient')

test('tests if no command gave an error', async () => {
  const handler = new CommandHandler(new LilirucaClient(), 'src/commands')
  const errorFn = jest.fn()
  handler.once('LOAD_ERROR', errorFn)
  await handler.loadAll()
  expect(errorFn).not.toHaveBeenCalled()
})

describe('Command Test', () => {
  const client = new LilirucaClient()
  const handler = new CommandHandler(client, 'src/commands')
  let commands

  beforeAll(async () => {
    await handler.loadAll()
    commands = handler.modules.array()
  })

  test('test if all commands have a description', () => {
    const locales = require('../locales/pt-br/commands.json')
    for (const command of commands) {
      expect(locales[command.id]?.description).toBeDefined()
    }
  })

  const MATCH_TYPES = ['phrase', 'rest']
  const IGNORE_KEYS = ['id', 'type', 'flagType']
  const getKeyInvalid = (arg, types) => {
    const opts = types.reduce((p, v) =>
      ({ ...p, ...ArgumentRunner.getTypes()[v].parseOptions(p) })
    , {})

    const keys = Object.keys(opts)
    for (const argKey of Object.keys(arg)) {
      if (!keys.includes(argKey) && !IGNORE_KEYS.includes(argKey)) {
        return argKey
      }
    }
  }

  test('test if the commands has all valid arguments', (done) => {
    for (const command of commands) {
      const args = command.args
      for (const arg of args) {
        if (arg.match && !MATCH_TYPES.includes(arg.match)) {
          done(new Error(`${command.id} contain argument \`match\` invalid \`${arg.match}\``))
        }

        if (Array.isArray(arg.type)) {
          for (const type of arg.type) {
            if (!ArgumentRunner.getTypes()[type]) {
              done(new Error(`${command.id} contain argument \`type\` invalid \`${type}\``))
            }
          }

          const keyInvalid = getKeyInvalid(arg, arg.type)
          if (keyInvalid) {
            done(new Error(`${command.id} contain a prop invalid in \`${arg.id}\`: ${keyInvalid}`))
          }
        } else {
          if (!ArgumentRunner.getTypes()[arg.type]) {
            done(new Error(`${command.id} contain argument \`type\` invalid \`${arg.type}\``))
          }
          const keyInvalid = getKeyInvalid(arg, [arg.type])
          if (keyInvalid) {
            done(new Error(`${command.id} contain a prop invalid in \`${arg.id}\`: ${keyInvalid}`))
          }
        }
      }
    }
    done()
  })

  test('test if the commands has all valid flags', (done) => {
    for (const command of commands) {
      const flags = command.flags
      for (const flag of flags) {
        if (flag.match && !MATCH_TYPES.includes(flag.match)) {
          done(new Error(`${command.id} contain flag \`match\` invalid \`${flag.match}\``))
        }

        if (!flag.flags) {
          done(new Error(`${command.id} command has a flag no flags \`${flag.id}\``))
        }

        if (!flag.flagType && flag.type) {
          done(new Error(`${command.id} command has a flag that has \`type\` but n has \`flagType\``))
        }

        if (flag.type) {
          if (Array.isArray(flag.type)) {
            for (const type of flag.type) {
              if (!ArgumentRunner.getTypes()[type]) {
                done(new Error(`${command.id} contain flag \`type\` invalid \`${type}\``))
              }
            }
            const keyInvalid = getKeyInvalid(flag, flag.type)
            if (keyInvalid) {
              done(new Error(`${command.id} contain a prop invalid in \`${flag.id}\`: ${keyInvalid}`))
            }
          } else {
            if (!ArgumentRunner.getTypes()[flag.type]) {
              done(new Error(`${command.id} contain flag \`type\` invalid \`${flag.type}\``))
            }
            const keyInvalid = getKeyInvalid(flag, [flag.type])
            if (keyInvalid) {
              done(new Error(`${command.id} contain a prop invalid in \`${flag.id}\`: ${keyInvalid}`))
            }
          }
        }
      }
    }
    done()
  })
})
