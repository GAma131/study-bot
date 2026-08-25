import 'dotenv/config';
import { buildBot } from './bot/bot.js';
import { SchedulerService } from './scheduler/study-scheduler.js';
import { connectMongo, disconnectMongo } from './config/mongo.js';

async function main(): Promise<void> {
  const token = process.env.BOT_TOKEN;
  const mongoUri = process.env.MONGO_URI;
  const scheduler = new SchedulerService();

  if (!token) {
    throw new Error('BOT_TOKEN is required');
  }

  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  const db = await connectMongo(mongoUri)
  const bot = await buildBot(token, scheduler, db);

  process.on('SIGINT', async () => {
    scheduler.cancelAll();
    await bot.stop();
    await disconnectMongo();
    process.exit(0);
  });

  await bot.start();
}

main();
