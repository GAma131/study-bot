import { type Bot, type Context } from 'grammy';
import { QuestionRepository } from '../../questions/repository';
import { formatQuestion } from './format-question';
import { SchedulerService } from '../../scheduler/study-scheduler';
import { formatAnswer } from './format-answer';

export function registerStudyCommand(
  bot: Bot<Context>,
  repo: QuestionRepository,
  scheduler: SchedulerService,
): void {
  bot.command('study', async (ctx) => {
    const question = repo.getRandom();
    const questionText = formatQuestion(question);

    // Enviar la pregunta y capturar el message_id
    const sentMessage = await ctx.reply(questionText, { parse_mode: 'HTML' });

    const chatId = ctx.chatId;
    const messageId = sentMessage.message_id;

    // Programar la revelación 5 minutos después
    scheduler.scheduleReveal(`chat-${chatId}`, question, async () => {
      const answerText = formatAnswer(question);
      await ctx.api.sendMessage(chatId, answerText, {
        parse_mode: 'HTML',
        reply_to_message_id: messageId,
      });
    });
  });
}
