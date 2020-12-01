const LilirucaCommand = require('@structures/LilirucaCommand')
const LilirucaEmbed = require('@structures/LilirucaEmbed')
const emojis = require('@constants/emojis')

class Help extends LilirucaCommand {
  constructor () {
    super('help', {
      aliases: ['hp', 'cmds', 'commands'],
      emoji: emojis.papyrus,
      clientPermissions: 'embedLinks',
      args: [
        {
          id: 'resolve',
          type: ['category', 'command']
        }
      ],
      flags: [
        {
          id: 'showAll',
          flags: ['all', 'a']
        }
      ]
    })
  }

  exec (message, { showAll, resolve }) {
    if (showAll) {
      return this.handleShowAll(message)
    }

    if (resolve instanceof LilirucaCommand) {
      return this.handleCommand(message, resolve)
    }

    if (message.handler.categories.includes(resolve)) {
      return this.handleCategory(message, resolve)
    }

    return this.handleDefault(message)
  }

  handleDefault ({ handler, prefix, util, ct, t }) {
    let i = 1
    const categories = handler.categories
      .reduce((desc, ctgy) => desc + `\`${i++}:\` \\${emojis[ctgy]} ** » ${t(`categories:${ctgy}`)}**\n`, '')

    const embed = new LilirucaEmbed()
      .setDescription(categories)
      .setFooter(`${prefix}help ${ct('usage')}`)

    util.send(`\\📚 ${ct('success')}`, embed)
  }

  handleShowAll ({ handler, util, ct, t }) {
    const categories = handler.categories
      .map(category => {
        const commands = handler.modules.filter(cmd => cmd.category === category)
        return {
          name: `\\${emojis[category]} » ${t(`categories:${category}`)}`,
          value: `${commands.map(({ id }) => `\`${id}\``).join(', ')}`
        }
      })

    const embed = new LilirucaEmbed()
      .addFields(categories)

    util.send(`\\📚 ${ct('all')}`, embed)
  }

  handleCategory ({ handler, t, util, prefix, ct }, category) {
    const filtered = handler.modules.filter(cmd => cmd.category === category)
    const commands = filtered.map(command => {
      const usage = command.usage ? ` ${t(`commands:${command.id}.usage`)}` : ''
      return {
        name: `\\${command.emoji} » ${command.id[0].toUpperCase() + command.id.slice(1)}`,
        value: `\`${t('commons:usage')} ${prefix + command.id}${usage}\` **- ${t(`commands:${command.id}.description`)}**`
      }
    })

    const embed = new LilirucaEmbed()
      .addFields(commands)

    const emoji = emojis[category]
    const categoryName = t(`categories:${category}`)

    util.send(`\\${emoji} ${ct('category', { category: categoryName })}`, embed)
  }

  handleCommand ({ t, prefix, util, ct }, command) {
    const usage = command.usage ? t(`commands:${command.id}.usage`) : ''
    const fields = [
      {
        name: `\\📖 ${t('commons:description')}`,
        value: `**${t(`commands:${command.id}.description`)}**`
      },
      {
        name: t('commons:howUse'),
        value: `**${prefix}${command.id} ${usage}**`,
        inline: true
      }
    ]

    if (command.aliases) {
      fields.push({
        name: `\\🚩 ${t('commons:aliases')}`,
        value: `**${command.aliases.filter(cmd => cmd !== command.id).join(', ')}**`,
        inline: true
      })
    }

    const embed = new LilirucaEmbed()
      .addFields(fields)

    util.send(`\\${command.emoji} ${ct('command', { command: command.id })}`, embed)
  }
}

module.exports = Help
