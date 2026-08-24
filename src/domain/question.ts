import { z } from 'zod'

export const QuestionSchema = z.object({
  id: z.string(),
  topic: z.string(),
  text: z.string().min(10),
  options: z.array(z.object({
    key: z.string().min(1),
    label: z.string()
  })).length(4),
  correctKey: z.string().min(1),
  explanation: z.string().min(10),
})

export type Question = z.infer<typeof QuestionSchema>

