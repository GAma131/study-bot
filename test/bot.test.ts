import { describe, it, expect, vi } from 'vitest';
import { buildBot } from '../src/bot/bot.js';
import { SchedulerService } from '../src/scheduler/study-scheduler.js';

describe('buildBot', () => {
  it('responde el comando /start', async () => {
    const scheduler = new SchedulerService();
    const bot = await buildBot('TEST_TOKEN_DUMMY', scheduler);
    bot.botInfo = {
      id: 12345,
      is_bot: true,
      first_name: 'Test Bot',
      username: 'test_bot',
    } as never;

    const apiCalls: { method: string; payload: unknown }[] = [];

    bot.api.config.use((prev, method, payload) => {
      apiCalls.push({ method, payload });
      return Promise.resolve({ ok: true, result: {} } as never);
    });

    const fakeUpdate = {
      update_id: 1,
      message: {
        message_id: 1,
        date: Math.floor(Date.now() / 1000),
        chat: { id: 12345, type: 'private' as const },
        from: { id: 67890, is_bot: false, first_name: 'Test' },
        text: '/start',
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

    expect(apiCalls).toContainEqual(
      expect.objectContaining({
        method: 'sendMessage',
        payload: expect.objectContaining({
          text: expect.stringContaining('¡Hola!'),
        }),
      }),
    );
  });

  it('responde a /study con una pregunta formateada', async () => {
    const scheduler = new SchedulerService();
    const bot = await buildBot('TEST_TOKEN_DUMMY', scheduler);
    bot.botInfo = {
      id: 1,
      is_bot: true,
      first_name: 'Bot',
      username: 'bot',
    } as never;

    const apiCalls: { method: string; payload: unknown }[] = [];
    bot.api.config.use((prev, method, payload) => {
      apiCalls.push({ method, payload });
      return Promise.resolve({ ok: true, result: {} } as never);
    });

    const studyUpdate = {
      update_id: 1,
      message: {
        message_id: 2,
        date: Math.floor(Date.now() / 1000),
        chat: { id: 12345, type: 'private' as const },
        from: { id: 67890, is_bot: false, first_name: 'Test' },
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

    await bot.handleUpdate(studyUpdate as never);

    expect(apiCalls).toContainEqual(
      expect.objectContaining({
        method: 'sendMessage',
        payload: expect.objectContaining({
          text: expect.stringContaining('Reacciona al mensaje'),
          parse_mode: 'HTML',
        }),
      }),
    );
  });

  it('responde a /study 15 y agenda el recurrente a ese intervalo', async () => {
    const scheduler = new SchedulerService();
    const bot = await buildBot('TEST_TOKEN_DUMMY', scheduler);
    bot.botInfo = {
      id: 1,
      is_bot: true,
      first_name: 'Bot',
      username: 'bot',
    } as never;

    const apiCalls: { method: string; payload: unknown }[] = [];
    bot.api.config.use((prev, method, payload) => {
      apiCalls.push({ method, payload });
      return Promise.resolve({
        ok: true,
        result: {
          message_id: apiCalls.length + 100,
          date: Math.floor(Date.now() / 1000),
          chat: { id: 12345, type: 'private' },
          text: (payload as any).text,
        },
      } as never);
    });

    const fakeUpdate = {
      update_id: 1,
      message: {
        message_id: 2,
        date: Math.floor(Date.now() / 1000),
        chat: { id: 12345, type: 'private' as const },
        from: { id: 67890, is_bot: false, first_name: 'Test' },
        text: '/study 15',
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

    expect(apiCalls.length).toBeGreaterThan(0);
    expect(
      apiCalls.some((call) => (call.payload as any).text?.includes('Modo estudio activado')),
    ).toBe(true);
  });

  it('responde a /study_stop cancelando el recurrente', async () => {
    const scheduler = new SchedulerService();
    const bot = await buildBot('TEST_TOKEN_DUMMY', scheduler);
    bot.botInfo = {
      id: 1,
      is_bot: true,
      first_name: 'Bot',
      username: 'bot',
    } as never;

    const cancelRecurringSpy = vi.spyOn(scheduler, 'cancelRecurring');
    const cancelRevealSpy = vi.spyOn(scheduler, 'cancelReveal');

    const apiCalls: { method: string; payload: unknown }[] = [];
    bot.api.config.use((prev, method, payload) => {
      apiCalls.push({ method, payload: payload as any });
      return Promise.resolve({
        ok: true,
        result: {
          message_id: apiCalls.length + 100,
          date: Math.floor(Date.now() / 1000),
          chat: { id: 12345, type: 'private' },
          text: (payload as any).text,
        },
      } as never);
    });

    const fakeUpdate = {
      update_id: 1,
      message: {
        message_id: 2,
        date: Math.floor(Date.now() / 1000),
        chat: { id: 12345, type: 'private' as const },
        from: { id: 67890, is_bot: false, first_name: 'Test' },
        text: '/study_stop',
        entities: [
          {
            type: 'bot_command' as const,
            offset: 0,
            length: 11,
          },
        ],
      },
    };

    await bot.handleUpdate(fakeUpdate as never);

    const confirmation = apiCalls.find((c) =>
      (c.payload as any).text?.includes('Modo estudio detenido'),
    );
    expect(confirmation).toBeDefined()
    expect(cancelRecurringSpy).toHaveBeenCalledWith('auto-12345');
    expect(cancelRevealSpy).toHaveBeenCalledWith('chat-12345');
  });

  it('responde a /help con la lista de comandos', async () => {
    const scheduler = new SchedulerService();
    const bot = await buildBot('TEST_TOKEN_DUMMY', scheduler);
    bot.botInfo = {
      id: 1,
      is_bot: true,
      first_name: 'Bot',
      username: 'bot',
    } as never;

    const apiCalls: { method: string; payload: unknown }[] = [];
    bot.api.config.use((prev, method, payload) => {
      apiCalls.push({ method, payload: payload as any });
      return Promise.resolve({
        ok: true,
        result: {
            message_id: 1,
          date: 0,
          chat: { id: 1, type: 'private' },
          text: (payload as any).text,
        },
      } as never);
    });

    const fakeUpdate = {
      update_id: 1,
      message: {
        message_id: 1,
        date: Math.floor(Date.now() / 1000),
        chat: { id: 12345, type: 'private' as const },
        from: { id: 67890, is_bot: false, first_name: 'Test' },
        text: '/help',
        entities: [
          {
            type: 'bot_command' as const,
            offset: 0,
            length: 5,
          },
        ],
      },
    };

    await bot.handleUpdate(fakeUpdate as never);

    const helpCall = apiCalls.find((c) =>
      (c.payload as any).text?.includes('Study Bot'),
    );
    expect(helpCall).toBeDefined()
    expect(helpCall?.payload).toEqual(
      expect.objectContaining({
        parse_mode: 'HTML',
        text: expect.stringContaining('/study')
      })
    )
    expect(helpCall?.payload).toEqual(
      expect.objectContaining({
        parse_mode: 'HTML',
        text: expect.stringContaining('/study_stop')
      })
    )
  });

  it('responde a /topics listando los temas únicos del repositorio', async () => {
    const scheduler = new SchedulerService();
    const bot = await buildBot('TEST_TOKEN_DUMMY', scheduler);
    bot.botInfo = {
      id: 1,
      is_bot: true,
      first_name: 'Bot',
      username: 'bot',
    } as never;

    const apiCalls: { method: string; payload: unknown }[] = [];
    bot.api.config.use((prev, method, payload) => {
      apiCalls.push({ method, payload: payload as any });
      return Promise.resolve({
        ok: true,
        result: {
            message_id: 1,
          date: 0,
          chat: { id: 1, type: 'private' },
          text: (payload as any).text,
        },
      } as never);
    });

    const fakeUpdate = {
      update_id: 1,
      message: {
        message_id: 1,
        date: Math.floor(Date.now() / 1000),
        chat: { id: 12345, type: 'private' as const },
        from: { id: 67890, is_bot: false, first_name: 'Test' },
        text: '/topics',
        entities: [
          {
            type: 'bot_command' as const,
            offset: 0,
            length: 7,
          },
        ],
      },
    };

    await bot.handleUpdate(fakeUpdate as never);

    const topicsCall = apiCalls.find((c) =>
      (c.payload as any).text?.includes('Temas disponibles'),
    );
    expect(topicsCall).toBeDefined()
    expect(topicsCall?.payload).toEqual(
      expect.objectContaining({
        parse_mode: 'HTML',
        text: expect.stringMatching(/•\s/),
      })
    )
  });
});
