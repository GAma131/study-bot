import { describe, it, expect} from "vitest";
import { Question } from "../src/domain/question";
import { formatQuestion } from "../src/bot/commands/format-question";

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
    const formatted = formatQuestion(fakeQuestion)
    expect(formatted).toContain('Test topic')
    expect(formatted).toContain('¿Cuál es la respuesta?')
    expect(formatted).toContain('Opción A')
    expect(formatted).toContain('Opción B')
    expect(formatted).toContain('Opción C')
    expect(formatted).toContain('Opción D')
    expect(formatted).toContain('Reacciona al mensaje con el emoji de tu respuesta')
  })
})
