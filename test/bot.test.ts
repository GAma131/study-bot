import { describe, it, expect } from 'vitest'
import { buildBot } from '../src/bot/bot.ts'

describe('buildBot', () => {
  it('responde el comando /start', async () => {
    const bot = buildBot('TEST_TOKEN_DUMMY')
    bot.botInfo = {
      id: 12345,
      is_bot: true,
      first_name: 'Test Bot',
      username: 'test_bot',
    } as never

    const apiCalls: { method: string, payload: unknown }[] = []

    bot.api.config.use((prev, method, payload) => {
      apiCalls.push({ method, payload })
      return Promise.resolve({ ok: true, result: {} } as never)
    })

    const fakeUpdate = {
      update_id: 1,
      message: {
        message_id: 1,
        date: Math.floor(Date.now() / 1000),
        chat: { id: 12345, type: 'private' as const },
        from: { id: 67890, is_bot: false, first_name: 'Test'},
        text: '/start',
        entities: [{
          type: 'bot_command' as const,
          offset: 0,
          length: 6,
        }]
      },
    }

    await bot.handleUpdate(fakeUpdate as never)

    expect(apiCalls).toContainEqual(
      expect.objectContaining({
        method: 'sendMessage',
        payload: expect.objectContaining({
          text: expect.stringContaining('¡Hola!')
        }),
      })
    )
  })
})
