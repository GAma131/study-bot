import { Bot, type Context } from 'grammy'
import { QuestionRepository } from '../questions/repository'
import { registerStudyCommand } from './commands/study'

export async function buildBot(token: string): Promise<Bot<Context>> {
  const bot = new Bot<Context>(token)

  bot.command('start', (ctx) =>
    ctx.reply('¡Hola!')
  )
  const repo = new QuestionRepository()
  await repo.load()
  registerStudyCommand(bot, repo)
  return bot
}

