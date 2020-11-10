const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { randomChances, random } = require('@utils/util')
const { getItemName, getItemById, getToolInInventory, removeItem, addItemInInventory } = require('@utils/items')
const { ENERGY_COST, EMOJIS: { mining } } = require('@constants')

class Mine extends LilirucaCommand {
  constructor () {
    super('mine', {
      aliases: ['mn'],
      emoji: mining,
      editable: true,
      clientPermissions: [
        'EMBED_LINKS',
        'USE_EXTERNAL_EMOJIS'
      ],
      args: [
        {
          id: 'itemId',
          type: 'itemId'
        }
      ]
    })
  }

  async exec ({ t, ct, util, db, author }, { itemId }) {
    const data = await db.users.get(author.id)

    if (!data.mining.level) {
      return util.send(t('errors:locked'))
    }

    if (data.energy < ENERGY_COST) {
      return util.send(t('errors:noEnergy'))
    }

    const pickaxe = (data.items[itemId] && getItemById(itemId)) || getToolInInventory(data, 'pickaxe')
    if (!pickaxe) {
      return util.send(ct('noPickaxe'))
    }

    const pickaxeId = itemId || pickaxe.id
    const pickaxeItem = itemId ? pickaxe : pickaxe.item

    const itemReward = randomChances(pickaxeItem.chances)
    const ore = pickaxeItem.rewards[itemReward]
    const amount = random(ore.max, ore.min, true)
    const { emoji } = getItemById(itemReward)
    const fields = [
      {
        name: `${pickaxeItem.emoji} ${t('commons:tool')}`,
        value: `**${getItemName(pickaxeId, t)}**`,
        inline: true
      },
      {
        name: `${emoji} ${t('commons:ore')}`,
        value: `**x${amount} ${getItemName(itemReward, t)}**`,
        inline: true
      }
    ]

    const limit = pickaxeItem.rewards.coal
    const coal = random(3)
    const coalItem = coal && getItemById('coal')
    const coalAmount = coal && random(limit.min, limit.max, true)

    if (coal) {
      addItemInInventory(data, 'items', 'coal', coalAmount)
      addItemInInventory(data, 'statistics', 'coal', coalAmount)

      fields.push({
        name: `${coalItem.emoji} ${t('commons:bonus')}`,
        value: `**x${coalAmount} ${getItemName('coal', t)}**`,
        inline: true
      })
    }

    removeItem(data, 'items', pickaxeId)
    addItemInInventory(data, 'items', itemReward, amount)
    addItemInInventory(data, 'statistics', itemReward, amount)
    addItemInInventory(data, 'statistics', pickaxeId, 1)

    const values = {
      energy: data.energy - ENERGY_COST
    }

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    util.send(`\\${mining} ${ct('success')}`, embed)
  }
}

module.exports = Mine
