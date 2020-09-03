const LilirucaClient = require('./client/LilirucaClient')
const client = new LilirucaClient()

client.login(process.env.DISCORD_TOKEN)
