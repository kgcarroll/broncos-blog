import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import Link from 'next/link'
import {ArticleBody} from '@/components/ArticleBody'
import {BoxScore} from '@/components/BoxScore'
import {SanityImage} from '@/components/SanityImage'
import {formatDate} from '@/lib/formatDate'
import {isSanityConfigured} from '@/lib/sanityConfigured'
import {sanityFetch} from '@/sanity/lib/live'
import {GAME_BY_PATH, GAME_PATHS} from '@/sanity/lib/queries'

type Props = {params: Promise<{year: string; matchup: string}>}

export async function generateStaticParams() {
  if (!isSanityConfigured()) return []
  try {
    const {data} = await sanityFetch({
      query: GAME_PATHS,
      perspective: 'published',
      stega: false,
    })
    return (data || []).map((row: {year: string; matchup: string}) => ({
      year: row.year,
      matchup: row.matchup,
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {year, matchup} = await params
  const {data} = await sanityFetch({
    query: GAME_BY_PATH,
    params: {year: Number(year), matchup},
    stega: false,
  })
  if (!data) return {title: 'Not found'}
  return {
    title: data.title || 'Game review',
    description: data.excerpt || undefined,
  }
}

export default async function GameReviewPage({params}: Props) {
  const {year, matchup} = await params
  const seasonYear = Number(year)
  if (!Number.isFinite(seasonYear)) notFound()

  const {data} = await sanityFetch({
    query: GAME_BY_PATH,
    params: {year: seasonYear, matchup},
  })
  if (!data) notFound()

  const date = formatDate(data.gameDate)
  const headerMatchup =
    data.awayTeam && data.homeTeam ? `${data.awayTeam} @ ${data.homeTeam}` : null

  return (
    <article>
      <Link href="/games" className="text-sm font-medium text-broncos-orange hover:underline">
        Back to game reviews
      </Link>
      <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-broncos-orange">
        {seasonYear}
        {headerMatchup ? ` | ${headerMatchup}` : ''}
      </p>
      {date ? (
        <time className="mt-1 block text-sm text-white/60" dateTime={data.gameDate ?? undefined}>
          {date}
        </time>
      ) : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">{data.title}</h1>
      {data.excerpt ? <p className="mt-4 text-lg text-white/80">{data.excerpt}</p> : null}

      {data.boxScore?.quarters?.length ? (
        <div className="mt-8 max-w-2xl">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-broncos-orange">
            Box score
          </h2>
          <BoxScore
            awayTeam={data.awayTeam || 'Away'}
            homeTeam={data.homeTeam || 'Home'}
            quarters={data.boxScore.quarters}
          />
        </div>
      ) : null}

      {data.coverImage?.asset?._id ? (
        <div className="mt-8 overflow-hidden">
          <SanityImage
            value={data.coverImage}
            sizes="(max-width: 768px) 100vw, 56rem"
            className="w-full"
            priority
          />
        </div>
      ) : null}

      <div className="mt-10 max-w-3xl">
        <ArticleBody value={data.body} />
      </div>
    </article>
  )
}
