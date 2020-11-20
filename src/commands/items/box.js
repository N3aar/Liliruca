const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { random, randomChances } = require('@utils/util')
const { getItemName, getItem, addItemInInventory, removeItem } = require('@utils/items')
const { PLACES, STORAGES_SIZE, PLACES_RESOURCES } = require('@constants/constant')
const items = require('@items')
const emojis = require('@constants/emojis')

class Box extends LilirucaCommand {
  constructor () {
    super('box', {
      aliases: ['bx'],
      emoji: emojis.gift,
      clientPermissions: [
        'embedLinks',
        'externalEmojis'
      ],
      args: [
        {
          id: 'box',
          type: Argument.validate('item', (m, p, value) => value.type === 'box'),
          otherwise: message => message.t('errors:noItem')
        }
      ]
    })
  }

  async exec ({ ct, t, db, author, util }, { box }) {
    const data = await db.users.ensure(author.id)

    if (!data.items[box.id]) {
      return util.send(ct('noBox'))
    }

    const itemReward = randomChances(box.chances)
    const packer = this[itemReward]
    const item = box.rewards[itemReward]
    const reward = packer ? packer(item, data, t) : {}

    const emoji = reward.emoji || `\\${emojis[itemReward]}`
    const value = reward.value || random(item.max, item.min, true)
    const type = reward.type || t(`commons:${itemReward}`)

    if (!reward.value) {
      data[itemReward] += value
    }

    removeItem(data, 'items', box.id)

    db.users.update(data, {})

    const fields = [
      {
        name: `${box.emoji} ${t('commons:box')}`,
        value: `**${getItemName(box.id, t)}**`,
        inline: true
      },
      {
        name: `${emoji} ${t('commons:reward')}`,
        value: `**x${value} ${type}**`,
        inline: true
      }
    ]

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\${emojis.gift} ${ct('success')}`, embed)
  }

  item (_, data, t) {
    const ids = Object.keys(items)
    const itemId = ids[random(ids.length)]
    const item = getItem(itemId)

    addItemInInventory(data, itemId, item.value)

    return {
      emoji: item.emoji,
      value: item.value,
      type: getItemName(itemId, t)
    }
  }

  resource (item, data, t) {
    const filter = PLACES.filter(place => data[place].level)
    const place = filter[random(filter.length)]
    const resource = PLACES_RESOURCES[place]
    const emoji = emojis[resource]
    const amount = random(item.max, item.min, true)
    const dataPlace = data[place]
    const limit = dataPlace.storage * STORAGES_SIZE[place]
    const total = dataPlace.amount + amount > limit ? limit - dataPlace.amount : amount

    dataPlace.amount += total

    return {
      emoji: `\\${emoji[random(emoji.length)]}`,
      value: amount,
      type: t(`commons:${resource}`)
    }
  }
}

module.exports = Box
