import { describe, it, expect } from 'vitest';
import { QuestionRepository } from '../src/questions/repository.js';

const mockQuestions = [
  {
    id: 'test-001',
    topic: 'test',
    text: '¿Pregunta de prueba?',
    options: [
      { key: '👍', label: 'A' },
      { key: '❤️', label: 'B' },
      { key: '😂', label: 'C' },
      { key: '🤣', label: 'D' },
    ],
    correctKey: '👍',
    explanation: 'Explicación de prueba',
  },
];

function createMockDb() {
  return {
    collection: () => ({
      find: () => ({
        toArray: () => Promise.resolve(mockQuestions),
      }),
      aggregate: () => ({
        toArray: () => Promise.resolve([mockQuestions[0]]),
      }),
      findOne: (query: { id: string }) =>
        Promise.resolve(mockQuestions.find((q) => q.id === query.id) || null),
      countDocuments: () => Promise.resolve(mockQuestions.length),
    }),
  };
}

describe('QuestionRepository', () => {
  it('getAll retorna preguntas', async () => {
    const repo = new QuestionRepository(createMockDb() as never);
    const questions = await repo.getAll();
    expect(questions.length).toBe(1);
  });

  it('getRandom retorna una pregunta', async () => {
    const repo = new QuestionRepository(createMockDb() as never);
    const q = await repo.getRandom(12345);
    expect(q.id).toBe('test-001');
  });

  it('getRandom no repite preguntas para el mismo chatId', async () => {
    const repo = new QuestionRepository(createMockDb() as never);

    const q1 = await repo.getRandom(12345);
    const q2 = await repo.getRandom(12345);

    expect(q1.id).toBe('test-001');
    expect(q2.id).toBe('test-001'); // se reinicia el ciclo
  });

  it('getById retorna la pregunta correcta', async () => {
    const repo = new QuestionRepository(createMockDb() as never);
    const q = await repo.getById('test-001');
    expect(q?.topic).toBe('test');
  });

  it('getByTopic retorna preguntas del tema', async () => {
    const repo = new QuestionRepository(createMockDb() as never);
    const qs = await repo.getByTopic('test');
    expect(qs.length).toBe(1);
  });
});
