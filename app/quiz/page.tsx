'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { selectQuestions, calculateScore } from '@/lib/quiz'
import QuestionCard from '@/components/QuestionCard'
import FeedbackCard from '@/components/FeedbackCard'
import ProgressBar from '@/components/ProgressBar'
import { Question } from '@/types'

type Phase = 'loading' | 'question' | 'feedback' | 'saving'

export default function QuizPage() {
  const router = useRouter()
  const supabase = createClient()

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<(boolean | null)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('*')

      if (error || !allQuestions || allQuestions.length < 10) {
        setError('Não há perguntas suficientes no banco. Adicione o seed SQL.')
        return
      }

      const selected = selectQuestions(allQuestions as Question[])
      setQuestions(selected)
      setAnswers(new Array(selected.length).fill(null))
      setPhase('question')
    }
    init()
  }, [])

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = answer
    setAnswers(newAnswers)
    setPhase('feedback')
  }

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setPhase('question')
    } else {
      setPhase('saving')
      const score = calculateScore(questions, answers)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('scores').insert({
          user_id: user.id,
          score,
          total_questions: questions.length,
        })
      }
      router.push(`/result?score=${score}&total=${questions.length}`)
    }
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto pt-8 text-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
          <p className="text-red-400 font-mono">{error}</p>
        </div>
      </div>
    )
  }

  if (phase === 'loading' || phase === 'saving') {
    return (
      <div className="max-w-2xl mx-auto pt-16 text-center">
        <div className="text-green-400 font-mono text-lg animate-pulse">
          {phase === 'loading' ? '> Carregando perguntas...' : '> Salvando resultado...'}
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      {/* Score parcial */}
      <div className="flex justify-end mb-4">
        <span className="font-mono text-sm text-gray-400">
          Score: <span className="text-green-400 font-bold">
            {answers.filter((a, i) => a !== null && a === questions[i]?.answer).length * 10}
          </span>/100
        </span>
      </div>

      {phase === 'question' && (
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={false}
        />
      )}

      {phase === 'feedback' && answers[currentIndex] !== null && (
        <FeedbackCard
          question={currentQuestion}
          userAnswer={answers[currentIndex] as boolean}
          onNext={handleNext}
          isLast={currentIndex === questions.length - 1}
        />
      )}
    </div>
  )
}
