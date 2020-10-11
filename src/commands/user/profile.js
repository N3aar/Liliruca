const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { EMOJIS: { picture, money, star } } = require('@constants')

class Profile extends LilirucaCommand {
  constructor () {
    super('profile', {
      aliases: ['pf', 'perfil'],
      emoji: picture,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'member',
          type: 'realMember',
          default: message => message.member
        }
      ]
    })
  }

  async exec ({ ct, t, db, util }, { member }) {
    const data = await db.users.get(member.id)

    const profile = [
      {
        name: `\\${money} ${t('commons:money')}`,
        value: `**$${data.money}**`,
        inline: true
      },
      {
        name: `\\${star} Lilistars`,
        value: `**${data.lilistars}**`,
        inline: true
      }
    ]

    const name = member.displayName
    const embed = new LilirucaEmbed()
      .addFields(profile)

    util.send(ct('success', { name }), embed)
  }
}

module.exports = Profile
