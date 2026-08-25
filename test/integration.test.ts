import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { QuestionRepository } from '../src/questions/repository.js';
import { SchedulerService } from '../src/scheduler/study-scheduler.js';
import { Bot, Context } from 'grammy';
import { registerStudyCommand } from '../src/bot/commands/study.js';

interface MockPayload {
  text?: string;
  chat_id?: number;
  parse_mode?: string;
  reply_to_message_id?: number;
  [key: string]: unknown;
}

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

    const apiCalls: { method: string; payload: MockPayload }[] = [];
    let lastMessageId = 100;

    bot.api.config.use((prev, method, payload) => {
      const p = payload as MockPayload;
      apiCalls.push({ method, payload: p });
      // Simula que Telegram devuelve un message_id incrementando
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
    const questionCall = apiCalls.find((c) => c.payload.text?.includes('Reacciona'));
    expect(questionCall).toBeDefined();
    expect(apiCalls.length).toBeGreaterThanOrEqual(1);
    expect(questionCall).toEqual(
      expect.objectContaining({
        method: 'sendMessage',
        payload: expect.objectContaining({
          chat_id: 555,
        }),
      }),
    );

    // 2. Avanzar 5 minutos
    vi.advanceTimersByTime(5 * 60 * 1000);

    // Necesitamos drenar las microtasks pendientes par que el setTimeout se complete
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

    // 3. Verificar que se envió UNA llamada MÁS (la respuesta, como reply)
    const answerCall = apiCalls.find((c) => c.payload.reply_to_message_id !== undefined);
    expect(answerCall).toBeDefined()
    expect(apiCalls.length).toBeGreaterThanOrEqual(3);
    expect(answerCall).toEqual(
      expect.objectContaining({
        method: 'sendMessage',
        payload: expect.objectContaining({
          chat_id: 555,
          parse_mode: 'HTML',
        }),
      }),
    );
  });
});
