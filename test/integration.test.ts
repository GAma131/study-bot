import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { QuestionRepository } from '../src/questions/repository';
import { SchedulerService } from '../src/scheduler/study-scheduler';
import { Bot, Context } from 'grammy';
import { registerStudyCommand } from '../src/bot/commands/study';

describe('integration: /study end-to-end', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('envía la pregunta y luego la respuesta 5 min después', async () => {
    const repo = new QuestionRepository();
    await repo.load();
    const scheduler = new SchedulerService();

    const bot = new Bot<Context>('TEST');
    bot.botInfo = {
      id: 1,
      is_bot: true,
      first_name: 'B',
      username: 'b',
    } as never;
    registerStudyCommand(bot, repo, scheduler);

    const apiCalls: { method: string; payload: unknown }[] = [];
    let lastMessageId = 100;

    bot.api.config.use((prev, method, payload) => {
      apiCalls.push({ method, payload: payload as any });
      // Simula que Telegram devuelve un message_id incrementando
      const p = payload as any;
      return Promise.resolve({
        ok: true,
        result: {
          message_id: p.text?.includes('Reacciona') ? 0 : lastMessageId++,
          date: Math.floor(Date.now() / 1000),
          chat: { id: p.chat_id, type: 'private' },
          text: p.text,
        },
      } as never);
    });

    const fakeUpdate = {
      update_id: 1,
      message: {
        message_id: 1,
        date: Math.floor(Date.now() / 1000),
        chat: { id: 555, type: 'private' as const },
        from: { id: 999, is_bot: false, first_name: 'Test' },
        text: '/study',
        entities: [
          {
            type: 'bot_command' as const,
            offset: 0,
            length: 6,
          },
        ],
      },
    };

    await bot.handleUpdate(fakeUpdate as never);

    // 1. Verificar que se envió UNA llamada (la pregunta)
    expect(apiCalls.length).toBe(1);
    expect(apiCalls[0]).toEqual(
      expect.objectContaining({
        method: 'sendMessage',
        payload: expect.objectContaining({
          chat_id: 555,
          text: expect.stringContaining('Reacciona'),
        }),
      }),
    );

    // 2. Avanzar 5 minutos
    vi.advanceTimersByTime(5 * 60 * 1000);

    // Necesitamos drenar las microtasks pendientes par que el setTimeout se complete
    await vi.runAllTimersAsync();

    // 3. Verificar que se envió UNA llamada MÁS (la respuesta, como reply)
    expect(apiCalls.length).toBe(2);
    expect(apiCalls[1]).toEqual(
      expect.objectContaining({
        method: 'sendMessage',
        payload: expect.objectContaining({
          chat_id: 555,
          reply_to_message_id: expect.any(Number),
          parse_mode: 'HTML',
        }),
      }),
    );
  });
});
