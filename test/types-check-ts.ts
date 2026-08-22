import { QuestionSchema } from '../src/domain/question.ts'
import data from '../src/questions/data.json'

const result = QuestionSchema.array().safeParse(data)
if(!result.success) {
  console.error(result.error.issues)
  process.exit()
}
console.log('Las 5 preguntas pasan la validación')
