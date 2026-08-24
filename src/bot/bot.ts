import { Bot, type Context } from 'grammy';
import { QuestionRepository } from '../questions/repository';
import { registerStudyCommand } from './commands/study';
import { SchedulerService } from '../scheduler/study-scheduler';
import { registerStudyStopCommand } from './commands/study-stop';
import { registerHelpCommand } from './commands/help';

export async function buildBot(token: string, scheduler: SchedulerService): Promise<Bot<Context>> {
  const bot = new Bot<Context>(token);

  bot.command('start', (ctx) => ctx.reply('¡Hola!'));

  const repo = new QuestionRepository();
  await repo.load();

  registerStudyCommand(bot, repo, scheduler);
  registerStudyStopCommand(bot, scheduler);
  registerHelpCommand(bot)

  return bot;
}
