import { Question } from '../../domain/question.js';
import { escapeHtml } from './escape-html.js';

const EMOJI_POOL = [
  '🎯', '🔥', '⭐', '🚀', '💡', '🎲', '🎪', '🌟',
  '⚡', '🎨', '🧩', '🎁', '🏆', '🔮', '🎭', '🌈',
  '🍀', '🎳', '🎸', '🦄', '🎈', '🪐', '🧠', '🎵',
  '🌙', '☀️', '🌊', '🍕', '🎮', '📚', '🔑', '🧭',
  '🪁', '🎺', '🛸', '🌵', '🍉', '🎧', '🧸', '🪄'
]

function pickRandomEmojis(count: number): string[] {
  const emojis = [...EMOJI_POOL].sort(() => Math.random() - 0.5).slice(0, count)
  return emojis
}

export function formatQuestion(q: Question) {
  const emojis = pickRandomEmojis(4)

  const opciones = q.options.map((opt, idx) => {
    const emoji = emojis[idx]
    const linea = `${emoji} <b>${opt.key}</b> - ${escapeHtml(opt.label)}`
    return linea
  })
  const bloqueOpciones = opciones.join('\n')

  const msg = `
  📚 <b>${escapeHtml(q.topic)}</b> \n
  \n
  ${escapeHtml(q.text)}
  \n
  ${bloqueOpciones}\n
  \n
  💭 Reacciona al mensaje con el emoji de tu respuesta
  `;

  return msg
}
