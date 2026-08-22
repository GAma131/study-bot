import { describe, it, expect} from "vitest";
import { QuestionRepository } from "../src/questions/repository";

describe('QuestionRepository', () => {
  it('carga las preguntas dedsde data.json', async () => {
    const repo = new QuestionRepository()
    await repo.load()
    expect(repo.getAll().length).toBe(5)
  })
})
