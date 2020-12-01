class ArgumentError extends Error {
  constructor (errorMessage) {
    super(errorMessage)
    this.errorMessage = errorMessage
  }
}

module.exports = ArgumentError
