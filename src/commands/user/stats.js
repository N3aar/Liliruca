const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { parseDuration } = require('@utils/date')
const { getPercentageFromSeason, calculateProduction } = require('@utils/util')
const { getToolInInventory, getItemName } = require('@utils/items')
const { PLACES_RESOURCES, PLACE_GENERATE, STORAGES_SIZE, PRODUCTION_LIMIT, PLACES_BOOSTERS, EMOJIS } = require('@constants')

class Stats extends LilirucaCommand {
  constructor () {
    super('stats', {
      aliases: ['st'],
      emoji: EMOJIS.graph,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'place',
          type: 'place',
          default: 'farm',
          unordered: true
        },
        {
          id: 'member',
          type: 'realMember',
          unordered: true,
          default: message => message.member
        }
      ]
    })
  }

  async exec ({ t, ct, language, db, util }, { place, member }) {
    const data = await db.users.ensure(member.id)
    const dataPlace = data[place]

    if (!dataPlace.level) {
      return util.send(t('errors:locked'))
    }

    const amount = dataPlace.amount
    const storageSize = dataPlace.storage * STORAGES_SIZE[place]

    const generate = dataPlace.level * PLACE_GENERATE[place]
    const generation = getPercentageFromSeason(generate, place).toLocaleString()

    const name = PLACES_BOOSTERS[place]
    const booster = name && getToolInInventory(data, name)

    const productionLimit = PRODUCTION_LIMIT[place] + (dataPlace.level * 2)
    const limit = getPercentageFromSeason(generate * productionLimit, place)
    const { production } = calculateProduction(data, generate, place, booster)
    const produced = production > limit ? limit : production
    const percentage = Math.floor((produced / limit) * 100)

    const resource = PLACES_RESOURCES[place]
    const emojis = EMOJIS[resource]
    const resourceEmoji = emojis[Math.floor(Math.random() * emojis.length)]

    const stats = [
      {
        name: `\\${EMOJIS.money} ${t('commons:money')}`,
        value: `**$${data.money.toLocaleString()}**`,
        inline: true
      },
      {
        name: `\\${EMOJIS[place]} ${t(`commons:${place}`)}`,
        value: `**${t('commons:level', { level: dataPlace.level })}**`,
        inline: true
      },
      {
        name: `\\${EMOJIS.storage} ${t('commons:storage')}`,
        value: `**${t('commons:level', { level: dataPlace.storage })}**`,
        inline: true
      },
      {
        name: `\\${resourceEmoji} ${t(`commons:${resource}`)}`,
        value: `**${t('commons:amount')}: ${amount.toLocaleString()}/${storageSize.toLocaleString()}**`,
        inline: true
      },
      {
        name: `\\${EMOJIS.produced} ${t('commons:produced')}`,
        value: `**${produced.toLocaleString()}/${limit.toLocaleString()} (${percentage}%)**`,
        inline: true
      },
      {
        name: `\\${EMOJIS.production} ${t('commons:production')}`,
        value: `**${ct('production', { generation, max: productionLimit })}**`,
        inline: true
      }
    ]

    if (booster) {
      stats.push({
        name: `${booster.item.emoji} ${getItemName(booster.id, t)}`,
        value: ct('booster', { min: booster.item.min, max: booster.item.max }),
        inline: true
      })
    }

    const collectedAt = data.collectedAt || 0
    const past = Date.now() - collectedAt

    const last = !data.collectedAt ? ct('never') : ct('last', { time: parseDuration(past, language) })
    const embed = new LilirucaEmbed()
      .addFields(stats)
      .setFooter(last)

    util.send(`\\${EMOJIS.graph} ${ct('success', { name: member.displayName })}`, embed)
  }
}

module.exports = Stats
