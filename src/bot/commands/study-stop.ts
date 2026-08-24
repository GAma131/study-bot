import { type Bot, type Context } from 'grammy';
import { SchedulerService } from '../../scheduler/study-scheduler';

export function registerStudyStopCommand(
  bot: Bot<Context>,
  scheduler: SchedulerService,
): void {
  bot.command('study_stop', async (ctx) => {
    const chatId = ctx.chatId;

    scheduler.cancelRecurring(`auto-${chatId}`)
    scheduler.cancelReveal(`chat-${chatId}`)

    await ctx.reply(`Modo estudio detenido. Ya no recibirás preguntas automáticas.`)
  });
}

