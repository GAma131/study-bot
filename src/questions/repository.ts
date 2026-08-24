import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { QuestionSchema, type Question } from '../domain/question.js';

export class QuestionRepository {
  private questions: Question[] = [];

  async load(): Promise<void> {
    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    const ruta = join(__dirname, 'data.json')
    const raw = await readFile(ruta, 'utf-8');
    const data = JSON.parse(raw);
    const result = QuestionSchema.array().safeParse(data);
    if (!result.success) {
      console.error(result.error.issues);
      throw new Error('JSON inválido');
    }

    this.questions = result.data;

    if(this.questions.length === 0){
      console.error('No hay preguntas');
      throw new Error('No hay preguntas')
    }
  }

  getAll(): Question[] {
    return this.questions;
  }

  getRandom(): Question {
    const question = this.questions[Math.floor(Math.random() * this.questions.length)]
    if(!question) throw new Error('No se pudo obtener la pregunta')
    return question
  }

  getById(id: string): Question {
    const question = this.questions.find((q) => q.id === id)
    if(!question) throw new Error('No se pudo obtener la pregunta')
    return question
  }

  getByTopic(topic: string): Question[] {
    const questions = this.questions.filter((q) => q.topic === topic)
    if(!questions) throw new Error('No se pudo obtener la pregunta')
    return questions
  }
}
