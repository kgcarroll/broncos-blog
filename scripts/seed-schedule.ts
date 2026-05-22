/**
 * Seeds the seasonSchedule singleton with the 2025 Broncos regular season.
 *
 * Requires a token with write access in .env.local:
 *   SANITY_API_WRITE_TOKEN=...   (or SANITY_API_READ_TOKEN if it has Editor role)
 *
 * Run: npx tsx --env-file=.env.local scripts/seed-schedule.ts
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or a write-capable API token in .env.local')
  process.exit(1)
}

/** Denver kickoff times (Mountain Time) as ISO strings */
function kickoff(date: string, time24: string) {
  return `${date}T${time24}:00-06:00`
}

const weeks = [
  {
    weekNumber: 1,
    opponent: 'Kansas City Chiefs',
    isHome: false,
    gameDate: kickoff('2025-09-14', '18:15'),
    tvNetwork: 'ESPN/ABC',
  },
  {
    weekNumber: 2,
    opponent: 'Jacksonville Jaguars',
    isHome: true,
    gameDate: kickoff('2025-09-20', '14:05'),
    tvNetwork: 'CBS',
  },
  {
    weekNumber: 3,
    opponent: 'Los Angeles Rams',
    isHome: true,
    gameDate: kickoff('2025-09-27', '18:20'),
    tvNetwork: 'NBC',
  },
  {
    weekNumber: 4,
    opponent: 'San Francisco 49ers',
    isHome: false,
    gameDate: kickoff('2025-10-04', '14:25'),
    tvNetwork: 'CBS',
  },
  {
    weekNumber: 5,
    opponent: 'Los Angeles Chargers',
    isHome: false,
    gameDate: kickoff('2025-10-11', '14:05'),
    tvNetwork: 'CBS',
  },
  {
    weekNumber: 6,
    opponent: 'Seattle Seahawks',
    isHome: true,
    gameDate: kickoff('2025-10-15', '18:15'),
    tvNetwork: 'Prime Video',
  },
  {
    weekNumber: 7,
    opponent: 'Arizona Cardinals',
    isHome: false,
    gameDate: kickoff('2025-10-25', '14:05'),
    tvNetwork: 'CBS',
  },
  {
    weekNumber: 8,
    opponent: 'Kansas City Chiefs',
    isHome: true,
    gameDate: kickoff('2025-11-01', '14:25'),
    tvNetwork: 'CBS',
  },
  {
    weekNumber: 9,
    opponent: 'Carolina Panthers',
    isHome: false,
    gameDate: kickoff('2025-11-08', '11:00'),
    tvNetwork: 'CBS',
  },
  {
    weekNumber: 10,
    isBye: true,
    notes: 'Nov 15',
  },
  {
    weekNumber: 11,
    opponent: 'Las Vegas Raiders',
    isHome: true,
    gameDate: kickoff('2025-11-22', '14:25'),
    tvNetwork: 'CBS',
  },
  {
    weekNumber: 12,
    opponent: 'Pittsburgh Steelers',
    isHome: false,
    gameDate: kickoff('2025-11-27', '13:00'),
    tvNetwork: 'Prime Video',
  },
  {
    weekNumber: 13,
    opponent: 'Miami Dolphins',
    isHome: true,
    gameDate: kickoff('2025-12-06', '14:05'),
    tvNetwork: 'Fox',
  },
  {
    weekNumber: 14,
    opponent: 'New York Jets',
    isHome: false,
    gameDate: kickoff('2025-12-13', '11:00'),
    tvNetwork: 'CBS',
  },
  {
    weekNumber: 15,
    opponent: 'Las Vegas Raiders',
    isHome: false,
    gameDate: kickoff('2025-12-20', '14:25'),
    tvNetwork: 'CBS',
  },
  {
    weekNumber: 16,
    opponent: 'Buffalo Bills',
    isHome: true,
    gameDate: kickoff('2025-12-25', '14:30'),
    tvNetwork: 'Netflix',
  },
  {
    weekNumber: 17,
    opponent: 'New England Patriots',
    isHome: false,
    notes: 'Jan 2/3 - kickoff TBD',
  },
  {
    weekNumber: 18,
    opponent: 'Los Angeles Chargers',
    isHome: true,
    notes: 'Jan 9/10 - kickoff TBD',
  },
].map((week) => ({
  _type: 'scheduleWeek' as const,
  _key: `week-${week.weekNumber}`,
  ...week,
}))

const document = {
  _id: 'seasonSchedule',
  _type: 'seasonSchedule',
  seasonYear: 2025,
  title: 'Schedule',
  intro: 'Denver Broncos 2025 regular season schedule. Kickoff times are Mountain Time.',
  byeWeek: 10,
  weeks,
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token,
  useCdn: false,
})

await client.createOrReplace(document)
console.log('Published seasonSchedule with 18 weeks (bye week 10).')
