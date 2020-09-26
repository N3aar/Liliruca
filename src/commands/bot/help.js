const { Category, Argument } = require('discord-akairo')
const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const { findCategory, bold } = require('@utils/util')
const { EMOJIS } = require('@constants')

class Help extends LilirucaCommand {
  constructor () {
    super('help', {
      aliases: ['hp'],
      emoji: EMOJIS.papyrus,
      editable: true,
      args: [
        {
          id: 'resolve',
          type: Argument.union('commandAlias', findCategory)
        },
        {
          id: 'showAll',
          match: 'flag',
          flag: '--all'
        }
      ]
    })
  }

  exec (message, { showAll, resolve }) {
    if (showAll) {
      return this.handleShowAll(message)
    }

    if (resolve instanceof Category) {
      return this.handleCategory(message, resolve)
    }

    if (resolve instanceof LilirucaCommand) {
      return this.handleCommand(message, resolve)
    }

    return this.handleDefault(message)
  }

  handleDefault ({ client, prefix, util, ct, t }) {
    let i = 1
    const categories = client.categories
      .reduce((desc, ctgy) => desc + `\`${i++}:\` \\${EMOJIS[ctgy.id]} ** » ${t(`categories:${ctgy.id}`)}**\n`, '')

    const embed = new LilirucaEmbed()
      .setDescription(categories)
      .setFooter(`${prefix}help ${t('commands:help.usage')}`)

    util.send(ct('success'), embed)
  }

  handleShowAll ({ client, util, ct, t }) {
    const categories = client.categories.map(category => (
      {
        name: `\\${EMOJIS[category.id]} » ${t(`categories:${category.id}`)}`,
        value: `\`${category.map(({ id }) => id).join(', ')}\``
      }
    ))

    const embed = new LilirucaEmbed()
      .addFields(categories)

    util.send(ct('all'), embed)
  }

  handleCategory ({ t, util, prefix, ct }, category) {
    const commands = category.map(command => {
      const usage = command.usage ? t(`commands:${command.id}.usage`) : ''
      return {
        name: `\\${command.emoji} » ${command.id[0].toUpperCase() + command.id.slice(1)}`,
        value: `\`${t('commons:usage')} ${prefix + command.id} ${usage}\` **- ${t(`commands:${command.id}.description`)}**`
      }
    })

    const embed = new LilirucaEmbed()
      .addFields(commands)

    const emoji = EMOJIS[category]
    const categoryName = t(`categories:${category}`)

    util.send(ct('category', { emoji, category: categoryName }), embed)
  }

  handleCommand ({ t, prefix, util, ct }, command) {
    const usage = command.usage ? t(`commands:${command.id}.usage`) : ''
    const fields = [
      {
        name: `\\📖 ${t('commons:description')}`,
        value: bold(t(`commands:${command.id}.description`))
      },
      {
        name: t('commons:howUse'),
        value: bold(`${prefix}${command.id} ${usage}`),
        inline: true
      }
    ]

    if (command.aliases) {
      fields.push({
        name: `\\🚩 ${t('commons:aliases')}`,
        value: bold(command.aliases.filter(cmd => cmd !== command.id).join(', ')),
        inline: true
      })
    }

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(ct('command', { emoji: command.emoji, command: command.id }), embed)
  }
}

module.exports = Help
