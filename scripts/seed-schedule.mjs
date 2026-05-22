/**
 * Run: node --env-file=.env.local scripts/seed-schedule.mjs
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
  process.exit(1)
}

if (!token && process.env.SANITY_WRITE_TOKEN) {
  console.error(
    'Found SANITY_WRITE_TOKEN  the seed script expects SANITY_API_WRITE_TOKEN (exact name).',
  )
  process.exit(1)
}

if (!token) {
  console.error(`
Missing SANITY_API_WRITE_TOKEN in .env.local.

SANITY_API_READ_TOKEN (Viewer) cannot create documents. Create an Editor token:
  sanity.io/manage -> your project -> API -> Tokens -> Add API token -> Editor

Then add to .env.local:
  SANITY_API_WRITE_TOKEN=your_editor_token

Or import without a write token (uses your Sanity login):
  npx sanity login
  npx sanity documents create data/seasonSchedule-2025.json --replace
`)
  process.exit(1)
}

function kickoff(date, time24) {
  return `${date}T${time24}:00-06:00`
}

const weeks = [
  {weekNumber: 1, opponent: 'Kansas City Chiefs', isHome: false, gameDate: kickoff('2025-09-14', '18:15'), tvNetwork: 'ESPN/ABC'},
  {weekNumber: 2, opponent: 'Jacksonville Jaguars', isHome: true, gameDate: kickoff('2025-09-20', '14:05'), tvNetwork: 'CBS'},
  {weekNumber: 3, opponent: 'Los Angeles Rams', isHome: true, gameDate: kickoff('2025-09-27', '18:20'), tvNetwork: 'NBC'},
  {weekNumber: 4, opponent: 'San Francisco 49ers', isHome: false, gameDate: kickoff('2025-10-04', '14:25'), tvNetwork: 'CBS'},
  {weekNumber: 5, opponent: 'Los Angeles Chargers', isHome: false, gameDate: kickoff('2025-10-11', '14:05'), tvNetwork: 'CBS'},
  {weekNumber: 6, opponent: 'Seattle Seahawks', isHome: true, gameDate: kickoff('2025-10-15', '18:15'), tvNetwork: 'Prime Video'},
  {weekNumber: 7, opponent: 'Arizona Cardinals', isHome: false, gameDate: kickoff('2025-10-25', '14:05'), tvNetwork: 'CBS'},
  {weekNumber: 8, opponent: 'Kansas City Chiefs', isHome: true, gameDate: kickoff('2025-11-01', '14:25'), tvNetwork: 'CBS'},
  {weekNumber: 9, opponent: 'Carolina Panthers', isHome: false, gameDate: kickoff('2025-11-08', '11:00'), tvNetwork: 'CBS'},
  {weekNumber: 10, isBye: true, notes: 'Nov 15'},
  {weekNumber: 11, opponent: 'Las Vegas Raiders', isHome: true, gameDate: kickoff('2025-11-22', '14:25'), tvNetwork: 'CBS'},
  {weekNumber: 12, opponent: 'Pittsburgh Steelers', isHome: false, gameDate: kickoff('2025-11-27', '13:00'), tvNetwork: 'Prime Video'},
  {weekNumber: 13, opponent: 'Miami Dolphins', isHome: true, gameDate: kickoff('2025-12-06', '14:05'), tvNetwork: 'Fox'},
  {weekNumber: 14, opponent: 'New York Jets', isHome: false, gameDate: kickoff('2025-12-13', '11:00'), tvNetwork: 'CBS'},
  {weekNumber: 15, opponent: 'Las Vegas Raiders', isHome: false, gameDate: kickoff('2025-12-20', '14:25'), tvNetwork: 'CBS'},
  {weekNumber: 16, opponent: 'Buffalo Bills', isHome: true, gameDate: kickoff('2025-12-25', '14:30'), tvNetwork: 'Netflix'},
  {weekNumber: 17, opponent: 'New England Patriots', isHome: false, notes: 'Jan 2/3 - kickoff TBD'},
  {weekNumber: 18, opponent: 'Los Angeles Chargers', isHome: true, notes: 'Jan 9/10 - kickoff TBD'},
].map((week) => ({_type: 'scheduleWeek', _key: `week-${week.weekNumber}`, ...week}))

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token,
  useCdn: false,
})

const document = {
  _id: 'seasonSchedule',
  _type: 'seasonSchedule',
  seasonYear: 2025,
  title: 'Schedule',
  intro: 'Denver Broncos 2025 regular season schedule. Kickoff times are Mountain Time.',
  byeWeek: 10,
  weeks,
}

try {
  await client.createOrReplace(document)

  try {
    await client.delete('drafts.seasonSchedule')
    console.log('Removed stale Studio draft (drafts.seasonSchedule).')
  } catch (draftError) {
    if (draftError?.statusCode !== 404) {
      throw draftError
    }
  }

  const published = await client.fetch(
    `*[_id == "seasonSchedule"][0]{
      seasonYear,
      "week1": weeks[weekNumber == 1][0].opponent,
      "week10Bye": weeks[weekNumber == 10][0].isBye,
      "weekCount": count(weeks)
    }`,
  )

  console.log(`Seeded ${projectId}/${dataset} -> seasonSchedule`)
  console.log('Published document:', published)

  if (published?.week1 !== 'Kansas City Chiefs' || published?.weekCount !== 18) {
    console.warn(
      'Warning: published document does not match expected seed data. Check project/dataset in .env.local.',
    )
  }

  console.log(`
Done. If Studio still shows placeholder weeks, hard-refresh /studio and reopen Season schedule.
The site reads the published doc; reload /schedule (cache revalidates every 60s).
`)
} catch (error) {
  if (error?.statusCode === 403) {
    console.error(`
Permission denied. Your token needs Editor (or Admin) access, not Viewer.

Create a new token at sanity.io/manage -> API -> Tokens (Editor role),
set SANITY_API_WRITE_TOKEN in .env.local, and run npm run seed:schedule again.

Or run:
  npx sanity login
  npx sanity documents create data/seasonSchedule-2025.json --replace
`)
    process.exit(1)
  }
  throw error
}
