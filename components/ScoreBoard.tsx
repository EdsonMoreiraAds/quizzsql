import { RankingEntry } from '@/types'

interface ScoreBoardProps {
  entries: RankingEntry[]
}

export default function ScoreBoard({ entries }: ScoreBoardProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="font-mono text-lg">Nenhum score ainda.</p>
        <p className="text-sm mt-1">Seja o primeiro a jogar!</p>
      </div>
    )
  }

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-800">
            <th className="pb-3 text-gray-400 font-mono text-sm">#</th>
            <th className="pb-3 text-gray-400 font-mono text-sm">Jogador</th>
            <th className="pb-3 text-gray-400 font-mono text-sm text-center">Melhor Score</th>
            <th className="pb-3 text-gray-400 font-mono text-sm text-center">Partidas</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={entry.email}
              className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
            >
              <td className="py-4 font-mono text-lg">
                {medals[i] ?? <span className="text-gray-500 text-sm">{i + 1}</span>}
              </td>
              <td className="py-4">
                <span className="text-gray-200 text-sm">
                  {entry.email.split('@')[0]}
                  <span className="text-gray-600">@{entry.email.split('@')[1]}</span>
                </span>
              </td>
              <td className="py-4 text-center">
                <span className={`font-mono font-bold text-lg ${
                  entry.best_score === 100 ? 'text-yellow-400' :
                  entry.best_score >= 70 ? 'text-green-400' : 'text-gray-300'
                }`}>
                  {entry.best_score}
                </span>
                <span className="text-gray-500 text-xs">/100</span>
              </td>
              <td className="py-4 text-center text-gray-400 text-sm font-mono">
                {entry.total_games}x
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
