import 'dotenv/config'
import { buildBot } from './bot/bot.js'

async function main(): Promise<void> {
  const token = process.env.BOT_TOKEN

  if(!token) {
    throw new Error('BOT_TOKEN is required')
  }

  const bot = buildBot(token)
  
  process.on('SIGINT', async () => {
    await bot.stop()
    process.exit(0)
  })

  await bot.start()
}

main()
