const BaseArgument = require('@structures/base/BaseArgument')

class CategoryArgument extends BaseArgument {
  static exec (arg, ctx) {
    const resolved = arg.toLowerCase()
    const number = Number(arg)

    return ctx.handler.categories.find((category, i) => {
      if (number === (i + 1) || category === resolved) {
        return true
      }

      const categoryName = ctx.t(`categories:${category}`).toLowerCase()
      if (categoryName === resolved) {
        return true
      }

      return false
    })
  }
}

module.exports = CategoryArgument
