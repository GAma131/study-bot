import { Bot, type Context } from 'grammy'

export function buildBot(token: string): Bot<Context> {
  const bot = new Bot<Context>(token)

  bot.command('start', (ctx) =>
    ctx.reply('¡Hola! Soy tu Study Bot. Escribe /heop para ver los comandos')
  )

  return bot
}

