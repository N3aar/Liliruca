const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration } = require('@utils/date')
const { GIVE_COOLDOWN, GIVE_TAX, GIVE_MIN, EMOJIS: { handshake, money, bank } } = require('@constants')

class Give extends LilirucaCommand {
  constructor () {
    super('give', {
      aliases: ['gv'],
      emoji: handshake,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'mentionMember',
          type: 'realMember',
          otherwise: message => message.ct('noUser')
        },
        {
          id: 'amount',
          type: Argument.range('integer', GIVE_MIN, Infinity),
          otherwise: message => message.ct('noValue', { min: GIVE_MIN })
        }
      ]
    })
  }

  async exec ({ ct, t, language, db, member, util }, { mentionMember, amount }) {
    if (member.id === mentionMember.id) {
      return util.send(ct('yourself'))
    }

    const data = await db.users.get(member.id)
    const timestamp = Date.now() - data.givedAt || 0

    if (timestamp < GIVE_COOLDOWN && data.givedAt) {
      const remaining = GIVE_COOLDOWN - timestamp
      const time = parseDuration(remaining, language)
      return util.send(ct('cooldown', { time }))
    }

    if (amount > data.money) {
      return util.send(ct('noMoney'))
    }

    const receiverData = await db.users.get(mentionMember.id)
    const donate = Math.floor(amount * GIVE_TAX)
    const tax = Math.floor((1 - GIVE_TAX) * 100)

    const profile = [
      {
        name: `\\${money} ${t('commons:money')}`,
        value: `**$${donate}**`,
        inline: true
      },
      {
        name: `\\${bank} ${t('commons:tax')}`,
        value: `**${tax}%**`,
        inline: true
      }
    ]

    const giveValues = {
      money: data.money - amount,
      givedAt: Date.now()
    }

    const receiverValues = {
      money: receiverData.money + donate
    }

    db.users.update(data, giveValues)
    db.users.update(receiverData, receiverValues)

    const embed = new LilirucaEmbed()
      .addFields(profile)

    const giver = member.toString()
    const receiver = mentionMember.toString()

    util.send(ct('success', { giver, receiver, donate }), embed)
  }
}

module.exports = Give
