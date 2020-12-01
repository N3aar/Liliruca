const BaseArgument = require('@structures/base/BaseArgument')

class CategoryArgument extends BaseArgument {
  static exec (arg, ctx) {
    const resolved = arg.toLowerCase()
    const number = Number(arg)
    let i = 1

    return ctx.handler.categories.find(category => {
      if (number === i || category === resolved) {
        return true
      }

      const categoryName = ctx.t(`categories:${category}`).toLowerCase()
      if (categoryName === resolved) {
        return true
      }

      i++
      return false
    })
  }
}

module.exports = CategoryArgument
