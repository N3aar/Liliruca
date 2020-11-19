const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { random, randomChances } = require('@utils/util')
const { removeItem, getToolInInventory, addItemInInventory, addMultipleItemsInInventory } = require('@utils/items')
const { RARE_FISHES, WEIGHTS, TREASURE, ENERGY_COST } = require('@constants/constant')
const { fishs, money, balance, fishingpole } = require('@constants/emojis')

class Fish extends LilirucaCommand {
  constructor () {
    super('fish', {
      aliases: ['fh'],
      emoji: fishingpole,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'uses',
          type: Argument.range('integer', 1, 10, true),
          default: 1
        },
        {
          id: 'item',
          type: Argument.validate('item', (m, p, value) => value.tool === 'baits')
        },
        {
          id: 'all',
          match: 'flag',
          flag: '--all'
        }
      ]
    })
  }

  async exec ({ t, ct, util, db, author }, { item, uses, all }) {
    const data = await db.users.ensure(author.id)
    const dataPlace = data.fishing

    if (!dataPlace.level) {
      return util.send(t('errors:locked'))
    }

    if (all) {
      uses = Math.floor(data.energy / 10)
    }

    const energyCost = ENERGY_COST * uses
    if (!energyCost || data.energy < energyCost) {
      return util.send(t('errors:noEnergy'))
    }

    if (item && !data.items[item.id]) {
      return util.send(ct('noBaits'))
    }

    const baits = item || getToolInInventory(data, 'baits')
    if (!baits) {
      return util.send(ct('noBaits'))
    }

    if (data.items[baits.id] < uses) {
      return util.send(ct('insufficient'))
    }

    const fished = {
      weight: 0,
      fishs: {},
      rares: {},
      reward: {}
    }

    for (let i = 0; i < uses; i++) {
      Fish.randomFishs(fished, baits)
    }

    const fishing = Object.keys(fished.fishs)
    const rares = Object.keys(fished.rares)

    const stars = fished.reward.stars ? `\n${fished.reward.stars} Lilistars` : ''
    const parsed = fishing.reduce((value, fish) => value + `x${fished.fishs[fish]} ${ct(fish)}\n`, '')
    const emoji = Fish.getEmoji(fishing[0], rares[0])

    const fields = [
      {
        name: `${emoji} ${t('commons:fished')}`,
        value: `**${parsed}**`,
        inline: true
      },
      {
        name: `\\${balance} ${t('commons:weight')}`,
        value: `**${fished.weight}kg**`,
        inline: true
      },
      {
        name: `\\${money} ${t('commons:price')}`,
        value: `**$${fished.reward.money}${stars}**`,
        inline: true
      }
    ]

    removeItem(data, 'items', baits.id, uses)
    addMultipleItemsInInventory(data, 'statistics', { ...fished.fishs, ...fished.rares })

    const values = {
      energy: data.energy - energyCost,
      money: data.money + fished.reward.money,
      lilistars: data.lilistars + (fished.reward.stars || 0)
    }

    db.users.update(data, values)

    let description = ''

    if (fished.fishs.rare) {
      const fish = rares.reduce((vl, fs) => {
        const emoji = this.getEmoji('rare', fs)
        const amount = fished.rares[fs]
        const name = t(`commons:rares.${fs}`)

        return vl + `${emoji} x${amount} ${name}\n`
      }, '')

      description += `**${ct('fishRare', { fish })}**\n`
    }

    if (fished.fishs.trash) {
      description += `\\♻️ ${ct('recycle')}`
    }

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    if (description.length) {
      embed.setDescription(description)
    }

    util.send(`\\${fishingpole} ${ct('success')}`, embed)
  }

  static randomFishs (fishs, baits) {
    const { money, lilistars } = TREASURE
    const catched = randomChances(baits.chances)
    const weight = WEIGHTS[catched]
    const balance = random(weight.max, weight.min, true)
    const price = catched === 'treasure' ? random(money.max, money.min, true) : balance * weight.price

    fishs.weight += balance

    addItemInInventory(fishs, 'fishs', catched)
    addItemInInventory(fishs, 'reward', 'money', price)

    if (catched === 'rare') {
      return addItemInInventory(fishs, 'rares', RARE_FISHES[random(RARE_FISHES.length)])
    }

    if (catched === 'treasure') {
      addItemInInventory(fishs, 'reward', 'stars', random(lilistars.max, lilistars.min, true))
    }
  }

  static getEmoji (fish, rare) {
    const emojis = fishs[fish]

    if (Array.isArray(emojis)) {
      return emojis[random(emojis.length)]
    }

    if (typeof emojis === 'object') {
      return emojis[rare]
    }

    return emojis
  }
}

module.exports = Fish
