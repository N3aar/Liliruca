const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItem, getItemName } = require('@utils/items')
const { RARE_FISHES, STATISTICS_TYPES, STATISTICS_EMOJIS } = require('@constants/constant')
const { graph, blowfish, fishs: { rare } } = require('@constants/emojis')

class Statistics extends LilirucaCommand {
  constructor () {
    super('statistics', {
      aliases: ['sc'],
      emoji: graph,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'member',
          type: 'realMember',
          default: message => message.member
        },
        {
          id: 'showOnlyFish',
          match: 'flag',
          flag: '--rares'
        }
      ]
    })
  }

  async exec ({ ct, t, db, util }, { member, showOnlyFish }) {
    const data = await db.users.ensure(member.id)
    const values = data.statistics

    if (showOnlyFish) {
      return Statistics.showRareFishs(values, util, t, ct, member)
    }

    const getInfo = (array, type) =>
      array.map(id => {
        const name = `${getItemName(id, t)}`
        const count = `__\`${values[id]?.toLocaleString() ?? 0}\`__`
        const emoji = getItem(id).emoji

        return `${emoji} **${values[id] ? ct(type, { name, count }) : ct(`no${type}`, { name })}**`
      })

    const fishingInfo = STATISTICS_TYPES.fishing
      .map(id => {
        const emoji = STATISTICS_EMOJIS[id]
        const count = `__\`${values[id]?.toLocaleString() ?? 0}\`__`

        return `\\${emoji} **${values[id] ? ct(id, { count }) : ct(`no_${id}`)}**`
      })

    const fields = [
      {
        name: `\\${STATISTICS_EMOJIS.axe} ${ct('axe')}`,
        value: getInfo(STATISTICS_TYPES.axe, 'tool').join('\n'),
        inline: false
      },
      {
        name: `\\${STATISTICS_EMOJIS.pickaxe} ${ct('pickaxe')}`,
        value: getInfo(STATISTICS_TYPES.pickaxe, 'tool').join('\n'),
        inline: false
      },
      {
        name: `\\${STATISTICS_EMOJIS.materials} ${ct('materials')}`,
        value: getInfo(STATISTICS_TYPES.materials, 'material').join('\n'),
        inline: false
      },
      {
        name: `\\${STATISTICS_EMOJIS.fishing} ${ct('fishing')}`,
        value: fishingInfo.join('\n')
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(ct('purchased'))

    util.send(`\\${graph} ${ct('success', { member: member.displayName })}`, embed)
  }

  static showRareFishs (values, util, t, ct, member) {
    const fishs = RARE_FISHES.filter(fish => (fish in values))

    if (!fishs.length) {
      return util.send(ct('noRares'))
    }

    const list = fishs.reduce((desc, id) => desc + `${rare[id]} **${t(`commons:rares.${id}`)}: ${values[id]}**\n`, '')
    const embed = new LilirucaEmbed()
      .setDescription(list)
      .setFooter(`Total: ${values.rare}`)

    util.send(`\\${blowfish} ${ct('rareFishs', { member: member.displayName })}`, embed)
  }
}

module.exports = Statistics
