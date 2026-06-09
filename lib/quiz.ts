import { Question, Level } from '@/types'

const DISTRIBUTION: Record<Level, number> = {
  beginner: 3,
  basic: 3,
  intermediate: 2,
  advanced: 2,
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function selectQuestions(allQuestions: Question[]): Question[] {
  const selected: Question[] = []

  for (const [level, count] of Object.entries(DISTRIBUTION)) {
    const pool = allQuestions.filter((q) => q.level === level)
    const picked = shuffle(pool).slice(0, count)
    selected.push(...picked)
  }

  return shuffle(selected)
}

export function calculateScore(
  questions: Question[],
  answers: (boolean | null)[]
): number {
  let correct = 0
  questions.forEach((q, i) => {
    if (answers[i] === q.answer) correct++
  })
  return correct * 10
}
