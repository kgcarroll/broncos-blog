import Link from 'next/link'
import {NewsCard, type NewsCardItem} from '@/components/NewsCard'
import {sanityFetch} from '@/sanity/lib/live'
import {NEWS_LIST_LIMITED, SITE_SETTINGS} from '@/sanity/lib/queries'

export default async function HomePage() {
  const [{data: settings}, {data: news}] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS, stega: false}),
    sanityFetch({query: NEWS_LIST_LIMITED, params: {limit: 12}}),
  ])

  const items = (news ?? []) as NewsCardItem[]
  const title = settings?.title?.trim() || 'Broncos News'
  const tagline = settings?.description?.trim() || 'Unofficial Denver Broncos news and updates.'

  return (
    <div>
      <section className="rounded-2xl border border-broncos-orange/30 bg-gradient-to-br from-broncos-navy via-broncos-navy to-black px-6 py-12 md:px-10 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-broncos-orange">Denver Broncos</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-lg text-white/80">{tagline}</p>
        <Link
          href="/news"
          className="mt-8 inline-flex items-center rounded-lg bg-broncos-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-broncos-orange/90"
        >
          All news
        </Link>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Latest news</h2>
          <Link href="/news" className="text-sm font-medium text-broncos-orange hover:underline">
            View all
          </Link>
        </div>
        {items.length ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <NewsCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-white/60">
            No posts yet.{' '}
            <Link href="/studio" className="text-broncos-orange hover:underline">
              Open Studio
            </Link>{' '}
            to publish your first story.
          </p>
        )}
      </section>
    </div>
  )
}
