import { describe, it, expect } from 'vitest'
import { escapeHtml } from '../src/bot/commands/escape-html.js'
import { formatQuestion } from '../src/bot/commands/format-question.js'
import { formatAnswer } from '../src/bot/commands/format-answer.js'
import type { Question } from '../src/domain/question.js'

describe('escapeHtml', () => {
  it('escapa los caracteres HTML peligrosos', () => {
    expect(escapeHtml('<document>')).toBe('&lt;document&gt;')
    expect(escapeHtml('A & B')).toBe('A &amp; B')
    expect(escapeHtml('<instructions>')).toBe('&lt;instructions&gt;')
  })

  it('no modifica texto sin caracteres especiales', () => {
    expect(escapeHtml('Hola mundo')).toBe('Hola mundo')
    expect(escapeHtml('¿Cuál es la respuesta?')).toBe('¿Cuál es la respuesta?')
  })
})

const questionConHtml: Question = {
  id: 'test-html',
  topic: 'tags',
  text: '¿Para qué sirven <document> e <instructions>?',
  options: [
    { key: 'A', label: 'Para <b>destacar</b> texto' },
    { key: 'B', label: 'Para separar secciones' },
    { key: 'C', label: 'No sirven' },
    { key: 'D', label: 'Otra cosa' },
  ],
  correctKey: 'B',
  explanation: 'Las etiquetas <document> sirven para & delimitar.',
}

describe('formatQuestion escapa HTML del usuario', () => {
  it('no escapa el texto de la pregunta (solo los labels de opciones)', () => {
    const out = formatQuestion(questionConHtml)
    expect(out).toContain('<document>')
    expect(out).toContain('<instructions>')
  })

  it('escapa HTML en los labels de las opciones', () => {
    const out = formatQuestion(questionConHtml)
    expect(out).toContain('&lt;b&gt;destacar&lt;/b&gt;')
    expect(out).not.toContain('Para <b>destacar</b>')
  })

  it('mantiene los <b> que añades manualmente para formato', () => {
    const out = formatQuestion(questionConHtml)
    expect(out).toContain('<b>')
    expect(out).toContain('</b>')
  })
})

describe('formatAnswer escapa HTML del usuario', () => {
  it('escapa HTML en la explicación', () => {
    const out = formatAnswer(questionConHtml)
    expect(out).toContain('&lt;document&gt;')
    expect(out).toContain('&amp;')
    expect(out).not.toContain('<document>')
  })

  it('escapa HTML en el label de la opción correcta', () => {
    const out = formatAnswer({
      ...questionConHtml,
      correctKey: 'A',
    })
    expect(out).toContain('&lt;b&gt;destacar&lt;/b&gt;')
  })
})
