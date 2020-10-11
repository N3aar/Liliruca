const { Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { random } = require('@utils/util')
const { items, getItemById, addItemInInventory, getItemInInventoryByTier, removeUsedItem } = require('@utils/items')
const { PLACES, STORAGES_SIZE, PLACES_RESOURCES, EMOJIS } = require('@constants')

class Box extends LilirucaCommand {
  constructor () {
    super('box', {
      aliases: ['bx'],
      emoji: EMOJIS.gift,
      editable: true,
      clientPermissions: 'EMBED_LINKS',
      args: [
        {
          id: 'tier',
          type: Argument.range('integer', 1, 5),
          default: null
        }
      ]
    })
  }

  async exec ({ ct, t, db, member, util }, { tier }) {
    const data = await db.users.get(member.id)
    const id = tier && `box:${tier}`

    if (id && !data.activeItems[id]) {
      return util.send(ct('noBox'))
    }

    const box = getItemById(id) || getItemInInventoryByTier(data.activeItems, 'box', 5)
    if (!box) {
      return util.send(ct('empty'))
    }

    const boxId = id || box.id
    const boxItem = id ? box : box.item

    const itemReward = this.randomBox(boxItem)
    const packer = this[itemReward]
    const item = boxItem[itemReward]
    const reward = packer ? packer(item, data, t) : {}

    const emoji = reward.emoji || `\\${EMOJIS[itemReward]}`
    const value = reward.value || random(item.reward.max, item.reward.min, true)
    const type = reward.type || t(`commons:${itemReward}`)

    if (!reward.value) {
      data[itemReward] += value
    }

    removeUsedItem(data, boxId)

    db.users.update(data, {})

    const fields = [
      {
        name: `${boxItem.emoji} ${t('commons:box')}`,
        value: `**${t(`items:${boxId.replace(':', '_')}`)}**`,
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

    util.send(ct('success'), embed)
  }

  randomBox (item) {
    const chance = random(100, 1, true)
    switch (true) {
      case chance >= (item.item.min || 1) && chance <= item.item.max: return 'item'
      case chance >= item.lilistars.min && chance <= item.lilistars.max: return 'lilistars'
      case chance >= item.money.min && chance <= item.money.max: return 'money'
      case chance >= item.resource.min && chance <= (item.resource.max || 100): return 'resource'
    }
  }

  item (_, data, t) {
    const ids = Object.keys(items)
    const itemId = ids[random(ids.length)]
    const item = getItemById(itemId)
    const inventory = data.activeItems[itemId] ? 'activeItems' : 'items'

    addItemInInventory(data[inventory], itemId, item.value)
    data.markModified(inventory)

    return {
      emoji: item.emoji,
      value: item.value,
      type: t(`items:${itemId.replace(':', '_')}`)
    }
  }

  resource (item, data, t) {
    const filter = PLACES.filter(place => data[place].level)
    const place = filter[random(filter.length)]
    const resource = PLACES_RESOURCES[place]
    const emojis = EMOJIS[resource]
    const amount = random(item.reward.max, item.reward.min, true)
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
