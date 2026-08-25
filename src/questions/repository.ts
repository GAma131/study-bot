import { type Question } from '../domain/question.js';
import { Collection, Db } from 'mongodb';

export class QuestionRepository {
  private collection: Collection<Question>;

  constructor(db: Db) {
    this.collection = db.collection<Question>('questions');
  }

  async getAll(): Promise<Question[]> {
    return this.collection.find().toArray()
  }

  async getRandom(): Promise<Question> {
    const [question] = await this.collection.aggregate<Question>([
      { $sample: {size: 1}}
    ]).toArray();

    if (!question) throw new Error('No hay preguntas');

    return question;
  }

  async getById(id: string): Promise<Question | null> {
    return this.collection.findOne({id})
  }

  async getByTopic(topic: string): Promise<Question[]> {
    return this.collection.find({topic}).toArray()
  }
}
