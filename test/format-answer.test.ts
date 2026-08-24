import { describe, it, expect} from "vitest";
import { Question } from "../src/domain/question";
import { formatAnswer } from "../src/bot/commands/format-answer";

const fakeQuestion: Question = {
  id: 'test-001',
  topic: 'Test topic',
  text: '¿Cuál es la respuesta?',
  options: [
    { key: 'A', label: 'Opción A'},
    { key: 'B', label: 'Opción B'},
    { key: 'C', label: 'Opción C'},
    { key: 'D', label: 'Opción D'},
  ],
  correctKey: 'A',
  explanation: 'Porque si',
}

describe('formatQuestion', () => {
  it('se muestra la pregunta y sus opciones', async () => {
    const formatted = formatAnswer(fakeQuestion)
    expect(formatted).toContain('Opción A')
    expect(formatted).toContain('Porque si')
    expect(formatted).toContain('Respuesta correcta')
  })
})
