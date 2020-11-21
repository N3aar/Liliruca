module.exports = class CommandArgument {
  static async getFlagOptionArgs (flagOptionArgs, flagContent, handle) {
    const args = flagContent
    const result = {}

    for (const f of flagOptionArgs) {
      const index = args.findIndex(arg => f.flags.some(flag => arg.startsWith(`${flag} `)))
      if (index !== -1) {
        const lastIndex = f.match === 'rest' ? args.length : 1
        const query = args[index].split(' ').slice(1)
        const arg = query.slice(0, lastIndex)
        result[f.id] = await handle(arg.join(' '))
        args.splice(index, 1, arg.length ? query.join('').replace(arg.join(' '), '') : null)
      } else {
        result[f.id] = await handle(null)
      }
    }

    return { args: args, result }
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
