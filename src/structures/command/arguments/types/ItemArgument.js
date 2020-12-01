const BaseArgument = require('@structures/base/BaseArgument')
const ArgumentError = require('../ArgumentError')
const { getItem } = require('@utils/items')

class ItemArgument extends BaseArgument {
  static parseOptions (opts) {
    return {
      ...super.parseOptions(opts),
      itemType: opts?.itemType ?? null,
      itemTool: opts?.itemTool ?? null,
      forgeable: opts?.forgeable ?? null
    }
  }

  static exec (arg, ctx, opts) {
    const item = getItem(arg.toLowerCase())

    if (opts.itemType && item?.type !== opts.itemType) {
      throw new ArgumentError(ctx.t('errors:itemTypeInvalid'))
    }

    if (opts.itemTool && item?.tool !== opts.itemTool) {
      throw new ArgumentError(ctx.t('errors:itemToolInvalid'))
    }

    if (opts.craftable && !item?.craftable) {
      throw new ArgumentError(ctx.t('errors:itemNotCraftable'))
    }

    if (opts.forgeable && !item?.forge) {
      throw new ArgumentError(ctx.t('errors:itemNotForgeable'))
    }

    return item
  }
}

module.exports = ItemArgument
