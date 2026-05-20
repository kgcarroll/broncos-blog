import Link from 'next/link'
import {FeedCard} from '@/components/FeedCard'
import {FeedHero, HERO_COUNT} from '@/components/FeedHero'
import {mergeHomeFeed} from '@/lib/feed'
import {sanityFetch} from '@/sanity/lib/live'
import {GAMES_LIST_LIMITED, NEWS_LIST_LIMITED, SITE_SETTINGS} from '@/sanity/lib/queries'

const FEED_LIMIT = 12
const FETCH_PER_TYPE = 24

export default async function HomePage() {
  const [{data: settings}, {data: news}, {data: games}] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS, stega: false}),
    sanityFetch({query: NEWS_LIST_LIMITED, params: {limit: FETCH_PER_TYPE}}),
    sanityFetch({query: GAMES_LIST_LIMITED, params: {limit: FETCH_PER_TYPE}}),
  ])

  const items = mergeHomeFeed(news, games, FEED_LIMIT)
  const heroItems = items.slice(0, HERO_COUNT)
  const gridItems = items.slice(HERO_COUNT)
  const title = settings?.title?.trim() || 'Broncos News'
  const tagline = settings?.description?.trim() || 'Unofficial Denver Broncos news and updates.'

  return (
    <div>
      <header className="mb-6 border-b border-white/10 pb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-broncos-orange">Denver Broncos</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-white/70">{tagline}</p>
      </header>

      {heroItems.length > 0 ? (
        <FeedHero items={heroItems} />
      ) : (
        <p className="border border-dashed border-white/20 p-8 text-center text-white/60">
          No posts published yet. Check back soon.
        </p>
      )}

      {gridItems.length > 0 ? (
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">More stories</h2>
            <div className="flex gap-4 text-sm font-medium">
              <Link href="/news" className="text-broncos-orange hover:underline">
                All news
              </Link>
              <Link href="/games" className="text-broncos-orange hover:underline">
                All games
              </Link>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((item) => (
              <FeedCard key={item._id} item={item} />
            ))}
          </div>
        </section>
      ) : heroItems.length > 0 ? (
        <div className="mt-8 flex justify-center gap-6 text-center text-sm font-medium">
          <Link href="/news" className="text-broncos-orange hover:underline">
            All news
          </Link>
          <Link href="/games" className="text-broncos-orange hover:underline">
            All games
          </Link>
        </div>
      ) : null}
    </div>
  )
}
