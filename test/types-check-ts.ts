import type { Question } from '../src/domain/question.ts'

const q: Question = {
  id: '1',
  text: '¿Cuál es la opción correcta?',
  options: [
    { key: 'A', label: 'opcion 1' },
    { key: 'B', label: 'opcion 2' },
    { key: 'C', label: 'opcion 3' },
    { key: 'D', label: 'opcion 4' },
  ],
  correctKey: 'A',
  explanation: 'La A es la correcta por pues si'
}
