import { type Bot, type Context } from 'grammy';
import { QuestionRepository } from '../../questions/repository';
import { formatQuestion } from './format-question';

export function registerStudyCommand(bot: Bot<Context>, repo: QuestionRepository): void {
  bot.command('study', async (ctx) => {
    const question = repo.getRandom();
    const text = formatQuestion(question);
    await ctx.reply(text, { parse_mode: 'HTML'})
  });
}
