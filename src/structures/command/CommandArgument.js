
const REST_FLAG_OPTION_REGEX = flags => new RegExp(`\\s--(${flags})\\s(.{1,})(--)?`, 'i')
const PHRASE_FLAG_OPTION_REGEX = flags => new RegExp(`\\s--(${flags})\\s(\\w{1,})(\\s)`, 'i')
const FLAG_REGEX = flags => new RegExp(`\\s?--(${flags})`, 'i')

module.exports = class CommandArgument {
  static getFlagOption (content, flagOptionArg) {
    const regex = flagOptionArg.match === 'rest' ? REST_FLAG_OPTION_REGEX : PHRASE_FLAG_OPTION_REGEX
    const result = content.match(regex(flagOptionArg.flags.join('|')))

    if (!result || !result.length) {
      return null
    }

    const [, flag, res] = result
    const full = ` --${flag} ${res}`
    const newContent = content.replace(full, '')
    return { newContent, res }
  }

  static getFlag (content, flagArg) {
    const regex = FLAG_REGEX(flagArg.flags.join('|'))

    if (!regex.test(content)) {
      return false
    }

    const newContent = content.replace(regex, '')
    return { newContent, res: true }
  }

  // HANDLE PARA BUSCA O HANDLE E OPTIONS DO ARGUMENTO
  static getArgRunner () {
    return null
  }

  // HANDLE PARA EXECUTA UM ARGUMENT INDIVITUAL
  // EXECUÇÃO DIRENTE CASO O ARG.TYPE SEJA UMA ARRAY
  static execArg (res, arg) {
    return null
  }

  static async runFlags (content, flags, handle) {
    let currentContent = content
    const result = {}

    for (const flag of flags) {
      const res = flag.flagType === 'option'
        ? CommandArgument.getFlagOption(currentContent, flag)
        : CommandArgument.getFlag(currentContent, flag)

      result[flag.id] = await handle(res?.res ?? res, flag)
      currentContent = res?.newContent ?? currentContent
    }

    return { newContent: currentContent, result }
  }

  static async runArgs (content, args, handle) {
    const contentArgs = content.trim().split(' ')
    const result = {}

    for (const arg of args) {
      const lastIndex = arg.match === 'rest' ? contentArgs.length : 1
      const text = contentArgs.slice(0, lastIndex)?.join(' ') ?? null
      result[arg.id] = await handle(text, arg)
      contentArgs.splice(0, lastIndex)
    }

    return result
  }

  static async runParameters (contentArgs, commandFlags, commandArgs) {
    const {
      newContent,
      res
    } = await CommandArgument.runFlags(contentArgs.join(' '), commandFlags, CommandArgument.execArg)

    return { ...res, ...CommandArgument.runArgs(newContent.split(' '), commandArgs, CommandArgument.execArg) }
  }
}
