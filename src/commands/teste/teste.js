const LilirucaCommsnd = require('@structures/LilirucaCommand')

class Teste extends LilirucaCommsnd {
  constructor () {
    super('teste', {
      aliases: ['tst', 'tt'],
      editable: true
    })
  }

  async exec ({ util }) {
    util.send('teste')
  }
}

module.exports = Teste
