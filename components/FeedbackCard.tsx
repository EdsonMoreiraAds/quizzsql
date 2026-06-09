import { Question } from '@/types'

interface FeedbackCardProps {
  question: Question
  userAnswer: boolean
  onNext: () => void
  isLast: boolean
}

export default function FeedbackCard({ question, userAnswer, onNext, isLast }: FeedbackCardProps) {
  const isCorrect = userAnswer === question.answer

  return (
    <div className={`animate-fade-in rounded-2xl p-6 border-2 shadow-xl ${
      isCorrect
        ? 'bg-green-500/10 border-green-500'
        : 'bg-red-500/10 border-red-500'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{isCorrect ? '✅' : '❌'}</span>
        <div>
          <p className={`font-bold text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correto!' : 'Errado!'}
          </p>
          <p className="text-sm text-gray-400">
            A resposta é <strong className="text-gray-200">{question.answer ? 'Verdadeiro' : 'Falso'}</strong>
          </p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-700">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1 font-mono">Explicação</p>
        <p className="text-gray-200 leading-relaxed">{question.explanation}</p>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-green-500 hover:bg-green-400 text-gray-950 font-bold rounded-xl transition-colors"
      >
        {isLast ? 'Ver resultado →' : 'Próxima pergunta →'}
      </button>
    </div>
  )
}
