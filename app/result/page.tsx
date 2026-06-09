import Link from 'next/link'

interface Props {
  searchParams: Promise<{ score?: string; total?: string }>
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams
  const score = parseInt(params.score ?? '0')
  const total = parseInt(params.total ?? '10')
  const correct = score / 10
  const percent = (correct / total) * 100

  const getMessage = () => {
    if (score === 100) return { emoji: '🏆', title: 'Perfeito!', sub: 'Você acertou tudo! Você é um mestre do SQL.' }
    if (score >= 80) return { emoji: '🎉', title: 'Excelente!', sub: 'Ótimo desempenho! Quase perfeito.' }
    if (score >= 60) return { emoji: '👍', title: 'Bom trabalho!', sub: 'Você tem bom conhecimento em SQL.' }
    if (score >= 40) return { emoji: '📚', title: 'Continue estudando!', sub: 'Há espaço para melhorar. Tente novamente!' }
    return { emoji: '💪', title: 'Não desanime!', sub: 'Revise os conceitos e tente novamente!' }
  }

  const { emoji, title, sub } = getMessage()

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="max-w-lg mx-auto pt-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-400 mb-8">{sub}</p>

        {/* Score */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className={`text-6xl font-bold font-mono ${getScoreColor()}`}>
            {score}
          </div>
          <div className="text-gray-400 text-sm mt-1">pontos de 100</div>

          <div className="mt-4 flex justify-center gap-8 text-sm">
            <div>
              <span className="text-green-400 font-bold font-mono">{correct}</span>
              <span className="text-gray-400"> corretas</span>
            </div>
            <div>
              <span className="text-red-400 font-bold font-mono">{total - correct}</span>
              <span className="text-gray-400"> erradas</span>
            </div>
          </div>

          {/* Barra */}
          <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
            <div
              className={`h-3 rounded-full transition-all ${
                score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/quiz"
            className="w-full py-3 bg-green-500 hover:bg-green-400 text-gray-950 font-bold rounded-xl transition-colors"
          >
            Jogar novamente →
          </Link>
          <Link
            href="/ranking"
            className="w-full py-3 border border-gray-700 hover:border-green-500 text-gray-300 hover:text-green-400 rounded-xl transition-colors"
          >
            🏆 Ver Ranking
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
}
