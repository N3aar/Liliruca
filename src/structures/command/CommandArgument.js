
const REST_FLAG_OPTION_REGEX = flags => new RegExp(`\\s--(${flags})\\s(.{1,})(--)?`, 'i')
const PHRASE_FLAG_OPTION_REGEX = flags => new RegExp(`\\s--(${flags})\\s(\\w{1,})(\\s)`, 'i')
// const FLAG_REGEX = flags => new RegExp(`\\s(--${flags})\\s`, 'gi')

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

  static async getFlagOptionArgs (flagOptionArgs, content, handle) {
    let currentContent = content
    const result = {}

    for (const flagArg of flagOptionArgs) {
      const res = CommandArgument.getFlagOption(currentContent, flagArg)

      result[flagArg.id] = await handle(res?.res ?? null)
      currentContent = res?.newContent ?? currentContent
    }

    return { newContent: currentContent, result }
  }

  // runArguments (commandArgs, messageArgs, message) {
  //   const result = {}
  //   // SEPARAR CADA PARTE EM FUNÇÕES E JA IR TESTANDO
  //   // TODO: separa o propriedade arg nessas 4 no command
  //   const { unorderedArgs, flags, flagOption, args } = commandArgs
  //     .reduce((p, v) => {
  //       if (v.match === 'flag') {
  //         return { ...p, flags: [...p.flags, v] }
  //       }
  //       if (v.match === 'option') {
  //         return { ...p, flagOption: [...p.flagOption, v] }
  //       }
  //       if (v.unordered) {
  //         return { ...p, unordered: [...p.unordered, v] }
  //       }
  //       return { ...p, args: [...p.args, v] }
  //     }, { unorderedArgs: [], flags: [], flagOption: [], args: [] })
  // }
}
