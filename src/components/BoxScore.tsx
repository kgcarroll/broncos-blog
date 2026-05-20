type QuarterScore = {
  away?: number | null
  home?: number | null
}

type BoxScoreProps = {
  awayTeam: string
  homeTeam: string
  quarters: QuarterScore[] | null | undefined
}

function sumQuarter(points: (number | null | undefined)[]) {
  return points.reduce<number>((total, n) => total + (typeof n === 'number' ? n : 0), 0)
}

export function BoxScore({awayTeam, homeTeam, quarters}: BoxScoreProps) {
  const rows = quarters?.length === 4 ? quarters : []
  if (!rows.length) return null

  const awayByQ = rows.map((q) => q.away)
  const homeByQ = rows.map((q) => q.home)
  const awayTotal = sumQuarter(awayByQ)
  const homeTotal = sumQuarter(homeByQ)
  const labels = ['Q1', 'Q2', 'Q3', 'Q4']

  return (
    <div className="overflow-x-auto border border-white/20">
      <table className="w-full min-w-[320px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/20 bg-white/5">
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-white/60">Team</th>
            {labels.map((label) => (
              <th key={label} className="px-4 py-3 text-center font-semibold text-broncos-orange">
                {label}
              </th>
            ))}
            <th className="px-4 py-3 text-center font-semibold text-white">T</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/10">
            <td className="px-4 py-3 font-medium text-white">{awayTeam}</td>
            {awayByQ.map((score, i) => (
              <td key={`away-${i}`} className="px-4 py-3 text-center tabular-nums text-white">
                {score ?? 0}
              </td>
            ))}
            <td className="px-4 py-3 text-center font-bold tabular-nums text-broncos-orange">{awayTotal}</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-white">{homeTeam}</td>
            {homeByQ.map((score, i) => (
              <td key={`home-${i}`} className="px-4 py-3 text-center tabular-nums text-white">
                {score ?? 0}
              </td>
            ))}
            <td className="px-4 py-3 text-center font-bold tabular-nums text-broncos-orange">{homeTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
