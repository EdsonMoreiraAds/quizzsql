import { createClient } from '@/lib/supabase/server'
import ScoreBoard from '@/components/ScoreBoard'
import Link from 'next/link'
import { RankingEntry } from '@/types'

export const revalidate = 60

export default async function RankingPage() {
  const supabase = await createClient()

  const { data: scores } = await supabase
    .from('scores')
    .select('user_id, score, played_at')
    .order('score', { ascending: false })

  // Montar ranking agrupado por usuário
  const rankingMap = new Map<string, { best_score: number; total_games: number; last_played: string }>()

  if (scores) {
    for (const s of scores) {
      const existing = rankingMap.get(s.user_id)
      if (!existing) {
        rankingMap.set(s.user_id, { best_score: s.score, total_games: 1, last_played: s.played_at })
      } else {
        if (s.score > existing.best_score) existing.best_score = s.score
        existing.total_games++
        if (s.played_at > existing.last_played) existing.last_played = s.played_at
      }
    }
  }

  // Buscar emails via auth (apenas disponível com service role)
  // Fallback: mostrar user_id truncado
  const entries: RankingEntry[] = Array.from(rankingMap.entries())
    .map(([userId, data]) => ({
      email: `jogador_${userId.slice(0, 6)}`,
      best_score: data.best_score,
      total_games: data.total_games,
      last_played: data.last_played,
    }))
    .sort((a, b) => b.best_score - a.best_score)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">🏆 Ranking</h1>
          <p className="text-gray-400 text-sm mt-1">Os melhores scores de todos os jogadores</p>
        </div>
        <Link
          href="/quiz"
          className="px-4 py-2 bg-green-500 hover:bg-green-400 text-gray-950 font-bold rounded-xl text-sm transition-colors"
        >
          Jogar agora
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <ScoreBoard entries={entries} />
      </div>

      <p className="text-center text-xs text-gray-600 mt-4">
        Atualizado a cada 60 segundos
      </p>
    </div>
  )
}
