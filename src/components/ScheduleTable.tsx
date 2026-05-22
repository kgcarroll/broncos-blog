import Link from 'next/link'
import {formatDate} from '@/lib/formatDate'
import {gamePath} from '@/lib/slugify'

export type ScheduleWeekRow = {
  weekNumber?: number | null
  isBye?: boolean | null
  opponent?: string | null
  isHome?: boolean | null
  gameDate?: string | null
  tvNetwork?: string | null
  notes?: string | null
  gameReview?: {
    title?: string | null
    seasonYear?: number | null
    matchupSlug?: string | null
  } | null
}

export type SeasonScheduleData = {
  seasonYear?: number | null
  title?: string | null
  intro?: string | null
  byeWeek?: number | null
  weeks?: ScheduleWeekRow[] | null
}

function reviewHref(review: ScheduleWeekRow['gameReview']) {
  if (review?.seasonYear != null && review.matchupSlug) {
    return gamePath(review.seasonYear, review.matchupSlug)
  }
  return null
}

export function ScheduleTable({schedule}: {schedule: SeasonScheduleData}) {
  const weeks = [...(schedule.weeks ?? [])].sort(
    (a, b) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0),
  )

  if (!weeks.length) {
    return <p className="text-white/60">Schedule weeks have not been added yet.</p>
  }

  return (
    <div className="overflow-x-auto border border-white/20">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/20 bg-white/5">
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-white/60">Week</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-white/60">Matchup</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-white/60">Date</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-white/60">TV</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-white/60">Review</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => {
            const isBye = Boolean(week.isBye)
            const date = formatDate(week.gameDate)
            const href = reviewHref(week.gameReview)

            if (isBye) {
              return (
                <tr key={week.weekNumber} className="border-b border-white/10 bg-broncos-orange/10">
                  <td className="px-4 py-4 font-bold tabular-nums text-broncos-orange">
                    {week.weekNumber}
                  </td>
                  <td colSpan={4} className="px-4 py-4 font-semibold uppercase tracking-widest text-broncos-orange">
                    Bye week
                  </td>
                </tr>
              )
            }

            const matchup = week.opponent
              ? `${week.isHome ? 'vs' : '@'} ${week.opponent}`
              : 'TBD'

            return (
              <tr key={week.weekNumber} className="border-b border-white/10">
                <td className="px-4 py-4 font-medium tabular-nums text-white">{week.weekNumber}</td>
                <td className="px-4 py-4 text-white">{matchup}</td>
                <td className="px-4 py-4 text-white/80">
                  {date ? (
                    <time dateTime={week.gameDate ?? undefined}>{date}</time>
                  ) : (
                    'TBD'
                  )}
                </td>
                <td className="px-4 py-4 text-white/70">{week.tvNetwork || '-'}</td>
                <td className="px-4 py-4">
                  {href ? (
                    <Link href={href} className="font-medium text-broncos-orange hover:underline">
                      {week.gameReview?.title || 'Read review'}
                    </Link>
                  ) : (
                    <span className="text-white/40">-</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
