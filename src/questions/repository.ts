import { type Question } from '../domain/question.js';
import { Collection, Db, Filter } from 'mongodb';

export class QuestionRepository {
  private collection: Collection<Question>;
  private shownByChat: Map<number, string[]> = new Map();

  constructor(db: Db) {
    this.collection = db.collection<Question>('questions');
  }

  async getAll(): Promise<Question[]> {
    return this.collection.find().toArray();
  }

  async getRandom(chatId: number): Promise<Question> {
    const filter: Filter<Question> = {};

    if (chatId) {
      const shown = this.shownByChat.get(chatId) || [];
      const total = await this.collection.countDocuments();

      if (shown.length >= total) {
        this.shownByChat.set(chatId, []);
      } else if (shown.length > 0) {
        filter.id = { $lnin: shown };
      }
    }

    const [question] = await this.collection
      .aggregate<Question>([{ $match: filter }, { $sample: { size: 1 } }])
      .toArray();

    if (!question) throw new Error('No hay preguntas');

    if (chatId) {
      const shown = this.shownByChat.get(chatId) || [];
      shown.push(question.id);
      this.shownByChat.set(chatId, shown);
    }

    return question;
  }

  async getById(id: string): Promise<Question | null> {
    return this.collection.findOne({ id });
  }

  async getByTopic(topic: string): Promise<Question[]> {
    return this.collection.find({ topic }).toArray();
  }
}
