import type {Metadata} from 'next'
import {NewsCard, type NewsCardItem} from '@/components/NewsCard'
import {sanityFetch} from '@/sanity/lib/live'
import {NEWS_LIST} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'News',
}

export default async function NewsPage() {
  const {data} = await sanityFetch({query: NEWS_LIST})
  const items = (data ?? []) as NewsCardItem[]

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">News</h1>
      <p className="mt-3 max-w-2xl text-white/70">
        Latest Denver Broncos stories, updates, and commentary.
      </p>
      {items.length ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-white/50">No news posts published yet.</p>
      )}
    </div>
  )
}
