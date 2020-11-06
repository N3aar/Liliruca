const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { random, randomChances } = require('@utils/util')
const { items, getItemName, getItemById, addItemInInventory, removeItem } = require('@utils/items')
const { PLACES, STORAGES_SIZE, PLACES_RESOURCES, EMOJIS } = require('@constants')

class Box extends LilirucaCommand {
  constructor () {
    super('box', {
      aliases: ['bx'],
      emoji: EMOJIS.gift,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'itemId',
          type: Argument.validate('itemId', (m, phrase) => phrase.startsWith('box_')),
          otherwise: message => message.t('errors:noItem')
        }
      ]
    })
  }

  async exec ({ ct, t, db, author, util }, { itemId }) {
    const data = await db.users.get(author.id)

    if (!data.items[itemId]) {
      return util.send(ct('noBox'))
    }

    const box = getItemById(itemId)
    const itemReward = randomChances(box.chances)
    const packer = this[itemReward]
    const item = box.rewards[itemReward]
    const reward = packer ? packer(item, data, t) : {}

    const emoji = reward.emoji || `\\${EMOJIS[itemReward]}`
    const value = reward.value || random(item.max, item.min, true)
    const type = reward.type || t(`commons:${itemReward}`)

    if (!reward.value) {
      data[itemReward] += value
    }

    removeItem(data, 'items', itemId)

    db.users.update(data, {})

    const fields = [
      {
        name: `${box.emoji} ${t('commons:box')}`,
        value: `**${getItemName(itemId, t)}**`,
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

    util.send(`\\${EMOJIS.gift} ${ct('success')}`, embed)
  }

  item (_, data, t) {
    const ids = Object.keys(items)
    const itemId = ids[random(ids.length)]
    const item = getItemById(itemId)

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
    const emojis = EMOJIS[resource]
    const amount = random(item.max, item.min, true)
    const dataPlace = data[place]
    const limit = dataPlace.storage * STORAGES_SIZE[place]
    const total = dataPlace.amount + amount > limit ? limit - dataPlace.amount : amount

    dataPlace.amount += total

    return {
      emoji: `\\${emojis[random(emojis.length)]}`,
      value: amount,
      type: t(`commons:${resource}`)
    }
  }
}

module.exports = Box
