import Link from 'next/link'
import {NewsCard, type NewsCardItem} from '@/components/NewsCard'
import {NewsHero, HERO_COUNT} from '@/components/NewsHero'
import {sanityFetch} from '@/sanity/lib/live'
import {NEWS_LIST_LIMITED, SITE_SETTINGS} from '@/sanity/lib/queries'

export default async function HomePage() {
  const [{data: settings}, {data: news}] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS, stega: false}),
    sanityFetch({query: NEWS_LIST_LIMITED, params: {limit: 12}}),
  ])

  const items = (news ?? []) as NewsCardItem[]
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
        <NewsHero items={heroItems} />
      ) : (
        <p className="border border-dashed border-white/20 p-8 text-center text-white/60">
          No posts published yet. Check back soon.
        </p>
      )}

      {gridItems.length > 0 ? (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">More news</h2>
            <Link href="/news" className="text-sm font-medium text-broncos-orange hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((item) => (
              <NewsCard key={item._id} item={item} />
            ))}
          </div>
        </section>
      ) : heroItems.length > 0 ? (
        <div className="mt-8 text-center">
          <Link href="/news" className="text-sm font-medium text-broncos-orange hover:underline">
            View all news
          </Link>
        </div>
      ) : null}
    </div>
  )
}
