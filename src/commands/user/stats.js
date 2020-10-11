const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration } = require('@utils/date')
const { getPercentageFromSeason, calculateProduction } = require('@utils/util')
const { PLACES_RESOURCES, PLACE_GENERATE, STORAGES_SIZE, PRODUCTION_LIMIT, EMOJIS } = require('@constants')

class Stats extends LilirucaCommand {
  constructor () {
    super('stats', {
      aliases: ['st'],
      emoji: EMOJIS.graph,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'place',
          type: 'place',
          default: 'farm'
        },
        {
          id: 'member',
          type: 'realMember',
          default: message => message.member
        }
      ]
    })
  }

  async exec ({ t, ct, language, db, util }, { place, member }) {
    const data = await db.users.get(member.id)
    const dataPlace = data[place]

    if (!dataPlace.level) {
      return util.send(t('errors:locked'))
    }

    const amount = dataPlace.amount
    const storageSize = dataPlace.storage * STORAGES_SIZE[place]

    const generate = dataPlace.level * PLACE_GENERATE[place]
    const generation = getPercentageFromSeason(generate, place)

    const productionLimit = PRODUCTION_LIMIT[place] + (dataPlace.level * 2)
    const limit = getPercentageFromSeason(generate * productionLimit, place)
    const calc = calculateProduction(data, generate, place)
    const produced = calc > limit ? limit : calc
    const percentage = Math.floor((produced / limit) * 100)

    const resource = PLACES_RESOURCES[place]
    const emojis = EMOJIS[resource]
    const resourceEmoji = emojis[Math.floor(Math.random() * emojis.length)]

    const stats = [
      {
        name: 'money',
        value: `$${data.money}`
      },
      {
        name: place,
        value: `Level ${dataPlace.level}`
      },
      {
        name: 'storage',
        value: `Level ${dataPlace.storage}`
      },
      {
        name: resource,
        value: `${t('commons:amount')}: ${amount}/${storageSize}`,
        emoji: resourceEmoji
      },
      {
        name: 'produced',
        value: `${produced}/${limit} (${percentage}%)`
      },
      {
        name: 'production',
        value: `${ct('production', { generation, max: productionLimit })}`
      }
    ]

    const fields = stats.map(field => ({
      name: `\\${field.emoji || EMOJIS[field.name]} ${t(`commons:${field.name}`)}`,
      value: `**${field.value}**`,
      inline: true
    }))

    const collectedAt = data.collectedAt || 0
    const past = Date.now() - collectedAt

    const last = !data.collectedAt ? ct('never') : ct('last', { time: parseDuration(past, language) })
    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(last)

    util.send(ct('success', { name: member.displayName }), embed)
  }
}

module.exports = Stats
