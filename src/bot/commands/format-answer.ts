import type { Question } from '../../domain/question.js';

export function formatAnswer(q: Question): string {
  // right question
  const rq = q.options.find((o) => o.key === q.correctKey);
  if(!rq) throw new Error(`No se encontró la opción correcta ${q.correctKey}`)

  const msg = `
  ✅ <b>Respuesta correcta</b> \n
  \n
  <b>${rq.key} - ${rq.label}</b> \n
  \n
  💡 ${q.explanation}
  `;

  return msg;
}
