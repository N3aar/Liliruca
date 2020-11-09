const { MessageAttachment } = require('discord.js')
const LilirucaCommand = require('@structures/LilirucaCommand')
const { EMOJIS: { picture } } = require('@constants')
const { drawProfile } = require('@utils/Canvas')
class Profile extends LilirucaCommand {
  constructor () {
    super('profile', {
      aliases: ['pf', 'perfil'],
      emoji: picture,
      editable: true,
      typing: true,
      clientPermissions: 'ATTACH_FILES',
      args: [
        {
          id: 'member',
          type: 'realMember',
          default: message => message.member
        }
      ]
    })
  }

  async exec ({ ct, db, util }, { member }) {
    const data = await db.users.get(member.id)
    const profile = new MessageAttachment(await drawProfile(data, member), 'profile.png')

    util.send(`\\${picture} ${ct('success', { name: member.displayName })}`, profile)
  }
}

module.exports = Profile
