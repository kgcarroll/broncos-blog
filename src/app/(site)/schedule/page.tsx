import type {Metadata} from 'next'
import {ScheduleTable, type SeasonScheduleData} from '@/components/ScheduleTable'
import {sanityFetch} from '@/sanity/lib/live'
import {SEASON_SCHEDULE} from '@/sanity/lib/queries'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: SEASON_SCHEDULE, stega: false})
  const title = data?.title?.trim() || 'Schedule'
  const year = data?.seasonYear
  return {
    title: year ? `${title} ${year}` : title,
    description: year
      ? `Denver Broncos ${year} regular season schedule.`
      : 'Denver Broncos regular season schedule.',
  }
}

export default async function SchedulePage() {
  const {data} = await sanityFetch({query: SEASON_SCHEDULE})
  const schedule = (data ?? null) as SeasonScheduleData | null

  if (!schedule) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-white">Schedule</h1>
        <p className="mt-4 text-white/70">
          Open Studio and create the Season schedule document to publish the schedule page.
        </p>
      </div>
    )
  }

  const pageTitle = schedule.title?.trim() || 'Schedule'
  const year = schedule.seasonYear

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">
        {pageTitle}
        {year ? ` ${year}` : ''}
      </h1>
      {schedule.intro ? <p className="mt-3 max-w-2xl text-white/70">{schedule.intro}</p> : null}
      {schedule.byeWeek ? (
        <p className="mt-2 text-sm font-medium text-broncos-orange">
          Bye week: Week {schedule.byeWeek}
        </p>
      ) : null}
      <div className="mt-10">
        <ScheduleTable schedule={schedule} />
      </div>
    </div>
  )
}
