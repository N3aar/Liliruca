const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getPercentageFromSeason, calculateProduction } = require('@utils/util')
const { EMOJIS, PLACES_RESOURCES, PLACE_GENERATE, STORAGES_SIZE, PRODUCTION_LIMIT_BY_LEVEL } = require('@constants')

const bold = string => `**${string}**`

class Stats extends LilirucaCommand {
  constructor () {
    super('stats', {
      aliases: ['st'],
      emoji: EMOJIS.graph,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'SEND_MESSAGES'
      ],
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

  async exec ({ t, ct, db, util }, { place, member }) {
    const data = await db.users.get(member.id)
    const dataPlace = data[place]

    if (!dataPlace.level) {
      return util.send(t('errors:locked'))
    }

    const amount = dataPlace.amount
    const storageSize = dataPlace.storage * STORAGES_SIZE[place]

    const generate = dataPlace.level * PLACE_GENERATE[place]
    const generation = getPercentageFromSeason(generate, place)
    const produced = calculateProduction(data.collectedAt, dataPlace.level, generation, place)

    const limit = PRODUCTION_LIMIT_BY_LEVEL[place][dataPlace.level]
    const limitProduction = getPercentageFromSeason(generation * limit, place)
    const percentage = Math.floor((produced / limitProduction) * 100)

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
        value: `${produced}/${limitProduction} (${percentage}%)`
      },
      {
        name: 'production',
        value: `${ct('production', { generation, max: limit })}`
      }
    ]

    const fields = stats.map(field => ({
      name: `\\${field.emoji || EMOJIS[field.name]} ${t(`commons:${field.name}`)}`,
      value: bold(field.value),
      inline: true
    }))

    const name = member.displayName
    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(ct('success', { name }), embed)
  }
}

module.exports = Stats
