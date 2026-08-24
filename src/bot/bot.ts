import { Bot, type Context } from 'grammy';
import { QuestionRepository } from '../questions/repository.js';
import { registerStudyCommand } from './commands/study.js';
import { SchedulerService } from '../scheduler/study-scheduler.js';
import { registerStudyStopCommand } from './commands/study-stop.js';
import { registerHelpCommand } from './commands/help.js';
import { registerTopicsCommand } from './commands/topics.js';

export async function buildBot(token: string, scheduler: SchedulerService): Promise<Bot<Context>> {
  const bot = new Bot<Context>(token);

  bot.command('start', (ctx) => ctx.reply('¡Hola!'));

  const repo = new QuestionRepository();
  await repo.load();

  registerStudyCommand(bot, repo, scheduler);
  registerStudyStopCommand(bot, scheduler);
  registerHelpCommand(bot)
  registerTopicsCommand(bot, repo)

  return bot;
}
