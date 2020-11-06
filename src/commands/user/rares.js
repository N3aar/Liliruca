const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { EMOJIS: { blowfish, rare } } = require('@constants')

class Rares extends LilirucaCommand {
  constructor () {
    super('rares', {
      aliases: ['rr'],
      emoji: blowfish,
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
    const rares = data.raresFishs
    const fishs = Object.keys(rares).filter(fs => fs !== 'total')

    if (!fishs.length) {
      return util.send(ct('noRares'))
    }

    const list = fishs.reduce((desc, id) => desc + `${rare[id]} **${t(`commons:rares.${id}`)}: ${rares[id]}**\n`, '')
    const embed = new LilirucaEmbed()
      .setDescription(list)
      .setFooter(`Total: ${rares.total}`)

    util.send(`\\${blowfish} ${ct('success', { member: member.displayName })}`, embed)
  }
}

module.exports = Rares
