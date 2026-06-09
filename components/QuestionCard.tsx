import { Question } from '@/types'

interface QuestionCardProps {
  question: Question
  onAnswer: (answer: boolean) => void
  disabled: boolean
}

const levelLabel: Record<string, string> = {
  beginner: 'Iniciante',
  basic: 'Básico',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

const levelColor: Record<string, string> = {
  beginner: 'text-green-400 bg-green-400/10',
  basic: 'text-blue-400 bg-blue-400/10',
  intermediate: 'text-yellow-400 bg-yellow-400/10',
  advanced: 'text-red-400 bg-red-400/10',
}

export default function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  return (
    <div className="animate-fade-in bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full font-mono ${levelColor[question.level]}`}>
          {levelLabel[question.level]}
        </span>
        <span className="text-xs text-gray-500 font-mono">{question.topic}</span>
      </div>

      <p className="font-mono text-gray-100 text-lg leading-relaxed mb-8">
        {question.statement}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => onAnswer(true)}
          disabled={disabled}
          className="flex-1 py-4 rounded-xl font-bold text-lg border-2 border-green-500 text-green-400
            hover:bg-green-500 hover:text-gray-950 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Verdadeiro
        </button>
        <button
          onClick={() => onAnswer(false)}
          disabled={disabled}
          className="flex-1 py-4 rounded-xl font-bold text-lg border-2 border-red-500 text-red-400
            hover:bg-red-500 hover:text-gray-950 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✗ Falso
        </button>
      </div>
    </div>
  )
}
