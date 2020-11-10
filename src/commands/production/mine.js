const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { randomChances, random } = require('@utils/util')
const { getItemName, getItem, getToolInInventory, removeItem, addItemInInventory } = require('@utils/items')
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
          id: 'item',
          type: 'item'
        }
      ]
    })
  }

  async exec ({ t, ct, util, db, author }, { item }) {
    const data = await db.users.get(author.id)

    if (!data.mining.level) {
      return util.send(t('errors:locked'))
    }

    if (data.energy < ENERGY_COST) {
      return util.send(t('errors:noEnergy'))
    }

    if (item && !data.items[item.id]) {
      return ct('noPickaxe')
    }

    const pickaxe = item || getToolInInventory(data, 'pickaxe')
    if (!pickaxe) {
      return util.send(ct('noPickaxe'))
    }

    const itemReward = randomChances(pickaxe.chances)
    const ore = pickaxe.rewards[itemReward]
    const amount = random(ore.max, ore.min, true)
    const { emoji } = getItem(itemReward)

    const fields = [
      {
        name: `${pickaxe.emoji} ${t('commons:tool')}`,
        value: `**${getItemName(pickaxe.id, t)}**`,
        inline: true
      },
      {
        name: `${emoji} ${t('commons:ore')}`,
        value: `**x${amount} ${getItemName(itemReward, t)}**`,
        inline: true
      }
    ]

    const limit = pickaxe.rewards.coal
    const coal = random(3)
    const coalItem = coal && getItem('coal')
    const coalAmount = coal && random(limit.min, limit.max, true)

    if (coal) {
      addItemInInventory(data, 'items', 'coal', coalAmount)

      fields.push({
        name: `${coalItem.emoji} ${t('commons:bonus')}`,
        value: `**x${coalAmount} ${getItemName('coal', t)}**`,
        inline: true
      })
    }

    removeItem(data, 'items', pickaxe.id)
    addItemInInventory(data, 'items', itemReward, amount)

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
