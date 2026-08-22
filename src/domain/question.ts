import { z } from 'zod'

const QuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(10),
  options: z.array(z.object({
    key: z.enum(['A', 'B', 'C', 'D']),
    label: z.string()
  })).length(4),
  correctKey: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().min(10),
})

export type Question = z.infer<typeof QuestionSchema>

