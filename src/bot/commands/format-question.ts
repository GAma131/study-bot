import { Question } from '../../domain/question';

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
    const linea = `${emoji} <b>${opt.key}</b> - ${opt.label}`
    return linea
  })
  const bloqueOpciones = opciones.join('\n')

  const msg = `
  📚 <b>${q.topic}</b> \n
  \n
  ${q.text}
  \n
  ${bloqueOpciones}\n
  \n
  💭 Reacciona al mensaje con el emoji de tu respuesta
  `;

  return msg
}
