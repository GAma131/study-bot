import { type Bot, type Context } from 'grammy';
import { QuestionRepository } from '../../questions/repository.js';

export function registerTopicsCommand(bot: Bot<Context>, repo: QuestionRepository): void {
  bot.command('topics', async (ctx) => {
    const allQuestion = await repo.getAll();
    const topics = [...new Set(allQuestion.map((q) => q.topic))];

    if (topics.length === 0) {
      return ctx.reply('No hay temas disponibles todavía');
    }

    const list = topics.map((t) => `\n• ${t}`);
    return ctx.reply(
      `📂 <b>Temas disponibles</b>
       ${list}
       `,
      { parse_mode: 'HTML' },
    );
  });
}
