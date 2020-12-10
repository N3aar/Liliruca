const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { getItemName, getItem } = require('@utils/items')
const { items } = require('@constants/emojis')

class Tools extends LilirucaCommand {
  constructor () {
    super('tools', {
      aliases: ['tl'],
      emoji: items,
      clientPermissions: [
        'embedLinks',
        'externalEmojis'
      ]
    })
  }

  async exec ({ db, t, ct, author, util }) {
    const data = await db.users.ensure(author.id)
    const notEquipped = `\\❌ **${ct('notEquipped')}**`
    const tools = [
      {
        name: `\\🥤 ${ct('energetic')}`,
        value: this.getItemInformation(t, data, 'energetic') || notEquipped
      },
      {
        name: `\\🪓 ${ct('axe')}`,
        value: this.getItemInformation(t, data, 'axe') || notEquipped
      },
      {
        name: `\\🌱 ${ct('fertilizer')}`,
        value: this.getItemInformation(t, data, 'fertilizer') || notEquipped
      }
    ]

    if (data.fishing.level) {
      tools.push({
        name: `\\🎣 ${ct('baits')}`,
        value: this.getItemInformation(t, data, 'baits') || notEquipped
      })

      tools.push({
        name: `\\⛵ ${ct('fishingNet')}`,
        value: this.getItemInformation(t, data, 'fishingNet') || notEquipped
      })
    }

    if (data.mining.level) {
      tools.push({
        name: `\\⛏️ ${ct('pickaxe')}`,
        value: this.getItemInformation(t, data, 'pickaxe') || notEquipped
      })

      tools.push({
        name: `\\💣 ${ct('bomb')}`,
        value: this.getItemInformation(t, data, 'bomb') || notEquipped
      })
    }

    const autoEquip = data.tools.autoequip ? 'enable' : 'disable'
    const embed = new LilirucaEmbed()
      .addFields(tools)
      .setFooter(`${ct('autoequip')}: ${t(`commons:${autoEquip}`)}`)

    util.send(`\\${items} ${ct('success')}`, embed)
  }

  getItemInformation (t, data, name) {
    const item = data.tools[name]
    return item && `${getItem(item).emoji} **${getItemName(item, t)}**`
  }
}

module.exports = Tools
