export type Level = 'beginner' | 'basic' | 'intermediate' | 'advanced'

export interface Question {
  id: string
  statement: string
  answer: boolean
  explanation: string
  level: Level
  topic: string
  created_at: string
}

export interface Score {
  id: string
  user_id: string
  score: number
  total_questions: number
  played_at: string
}

export interface RankingEntry {
  email: string
  best_score: number
  total_games: number
  last_played: string
}

export interface QuizState {
  questions: Question[]
  currentIndex: number
  answers: (boolean | null)[]
  score: number
  finished: boolean
}
