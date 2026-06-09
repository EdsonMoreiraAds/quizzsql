import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ScoreBoard from '@/components/ScoreBoard'
import { RankingEntry } from '@/types'

export default async function Home() {
  const supabase = await createClient()

  const { data: scores } = await supabase
    .from('scores')
    .select('user_id, score, played_at')
    .order('score', { ascending: false })

  const { data: { users } } = await supabase.auth.admin.listUsers().catch(() => ({ data: { users: [] } }))

  // Montar ranking a partir dos scores
  const rankingMap = new Map<string, RankingEntry>()
  if (scores) {
    for (const s of scores) {
      const existing = rankingMap.get(s.user_id)
      const userEmail = users?.find((u: { id: string }) => u.id === s.user_id)?.email ?? s.user_id.slice(0, 8) + '...'
      if (!existing || s.score > existing.best_score) {
        rankingMap.set(s.user_id, {
          email: userEmail,
          best_score: s.score,
          total_games: (existing?.total_games ?? 0) + 1,
          last_played: s.played_at,
        })
      } else {
        existing.total_games++
      }
    }
  }
  const ranking = Array.from(rankingMap.values())
    .sort((a, b) => b.best_score - a.best_score)
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="text-center pt-8 pb-4">
        <div className="font-mono text-green-400 text-sm mb-4 opacity-70">
          {'> SELECT * FROM conhecimento WHERE nivel = "avancado"'}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Quiz <span className="text-green-400">SQL</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          Teste seu conhecimento em SQL com perguntas Verdadeiro ou Falso.
          Do banco de dados básico até tópicos avançados.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/quiz"
            className="px-8 py-3 bg-green-500 hover:bg-green-400 text-gray-950 font-bold rounded-xl text-lg transition-colors"
          >
            Começar Quiz →
          </Link>
          <Link
            href="/ranking"
            className="px-8 py-3 border border-gray-700 hover:border-green-500 text-gray-300 hover:text-green-400 rounded-xl text-lg transition-colors"
          >
            Ver Ranking
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { label: 'Perguntas', value: '50+' },
          { label: 'Níveis', value: '4' },
          { label: 'Por partida', value: '10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold font-mono text-green-400">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Ranking preview */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">🏆 Top Ranking</h2>
          <Link href="/ranking" className="text-sm text-green-400 hover:text-green-300">
            Ver todos →
          </Link>
        </div>
        <ScoreBoard entries={ranking} />
      </section>

      {/* Níveis */}
      <section>
        <h2 className="text-xl font-bold mb-4">Níveis de dificuldade</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { level: 'Iniciante', count: 3, color: 'border-green-500/40 text-green-400', topics: 'Banco de dados, tabelas, SELECT' },
            { level: 'Básico', count: 3, color: 'border-blue-500/40 text-blue-400', topics: 'WHERE, INSERT, UPDATE, DELETE' },
            { level: 'Intermediário', count: 2, color: 'border-yellow-500/40 text-yellow-400', topics: 'JOINs, GROUP BY, subqueries' },
            { level: 'Avançado', count: 2, color: 'border-red-500/40 text-red-400', topics: 'Índices, CTEs, transactions' },
          ].map((item) => (
            <div key={item.level} className={`bg-gray-900 border rounded-xl p-4 ${item.color}`}>
              <div className={`font-bold font-mono mb-1 ${item.color.split(' ')[1]}`}>{item.level}</div>
              <div className="text-xs text-gray-500 mb-2">{item.count} perguntas/partida</div>
              <div className="text-xs text-gray-400">{item.topics}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
