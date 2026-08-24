import { type Bot, type Context } from 'grammy';
import { QuestionRepository } from '../../questions/repository';
import { formatQuestion } from './format-question';
import { SchedulerService } from '../../scheduler/study-scheduler';
import { formatAnswer } from './format-answer';

async function sendQuestionToChat(
  chatId: number,
  bot: Bot<Context>,
  repo: QuestionRepository,
  scheduler: SchedulerService,
): Promise<void> {
  const question = repo.getRandom();
  const questionText = formatQuestion(question);

  const sentMessage = await bot.api.sendMessage(chatId, questionText, {
    parse_mode: 'HTML',
  });

  const messageId = sentMessage.message_id;

  scheduler.scheduleReveal(`chat-${chatId}`, question, async () => {
    const answerText = formatAnswer(question);
    await bot.api.sendMessage(chatId, answerText, {
      parse_mode: 'HTML',
      reply_to_message_id: messageId,
    });
  });
}

export function registerStudyCommand(
  bot: Bot<Context>,
  repo: QuestionRepository,
  scheduler: SchedulerService,
): void {
  bot.command('study', async (ctx) => {
    const arg = ctx.match;
    const intervalMin = Number(arg) || 30;
    const chatId = ctx.chatId;

    await sendQuestionToChat(chatId, bot, repo, scheduler);

    // Programar la revelación 5 minutos después
    scheduler.scheduleRecurring(
      `auto-${chatId}`,
      () => {
        sendQuestionToChat(chatId, bot, repo, scheduler).catch((err) => {
          console.log('Aunto-send failed:', err);
        });
      },
      intervalMin * 60 * 1000,
    );

    await ctx.reply(`✅ Modo estudio activado. Enviaré una pregunta cada ${intervalMin} minutos.`)
  });
}
