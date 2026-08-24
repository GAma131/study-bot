import 'dotenv/config';
import { buildBot } from './bot/bot.ts';
import { SchedulerService } from './scheduler/study-scheduler.ts';

async function main(): Promise<void> {
  const token = process.env.BOT_TOKEN;
  const scheduler = new SchedulerService();

  if (!token) {
    throw new Error('BOT_TOKEN is required');
  }

  const bot = await buildBot(token, scheduler);

  process.on('SIGINT', async () => {
    scheduler.cancelAll();
    await bot.stop();
    process.exit(0);
  });

  await bot.start();
}

main();
