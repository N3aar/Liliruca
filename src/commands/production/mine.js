const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { randomChances, random } = require('@utils/util')
const { getItemName, getItemById, getItemInInventoryByTier, removeItem, addItemInInventory } = require('@utils/items')
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
      ]
    })
  }

  async exec ({ t, ct, util, db, author }) {
    const data = await db.users.get(author.id)

    if (!data.mining.level) {
      return util.send(t('errors:locked'))
    }

    if (data.energy < ENERGY_COST) {
      return util.send(t('errors:noEnergy'))
    }

    const pickaxe = getItemInInventoryByTier(data.activeItems, 'pickaxe')
    if (!pickaxe) {
      return util.send(ct('noPickaxe'))
    }

    const itemReward = randomChances(pickaxe.item.chances)
    const item = pickaxe.item.rewards[itemReward]
    const amount = random(item.max, item.min, true)
    const { emoji } = getItemById(itemReward)
    const fields = [
      {
        name: `${pickaxe.item.emoji} ${t('commons:tool')}`,
        value: `**${getItemName(pickaxe, t)}**`,
        inline: true
      },
      {
        name: `${emoji} ${t('commons:ore')}`,
        value: `**x${amount} ${getItemName(itemReward, t)}**`,
        inline: true
      }
    ]

    const limit = pickaxe.item.rewards.coal
    const coal = random(2)
    const coalItem = coal && getItemById('coal')
    const coalAmount = coal && random(limit.min, limit.max, true)

    if (coal) {
      addItemInInventory(data, 'items', 'coal', coalAmount)

      fields.push({
        name: `${coalItem.emoji} ${t('commons:bonus')}`,
        value: `**x${coalAmount} ${getItemName('coal', t)}**`,
        inline: true
      })
    }

    removeItem(data, 'activeItems', pickaxe.id)
    addItemInInventory(data, 'items', itemReward, amount)

    const values = {
      energy: data.energy - ENERGY_COST
    }

    db.users.update(data, values)

    const embed = new LilirucaEmbed()
      .addFields(fields)
      .setFooter(t('commons:currentEnergy', { energy: values.energy }))

    util.send(`\\⛏️ ${ct('success')}`, embed)
  }
}

module.exports = Mine
