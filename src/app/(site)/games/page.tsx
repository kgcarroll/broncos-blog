import type {Metadata} from 'next'
import {GameCard, type GameCardItem} from '@/components/GameCard'
import {sanityFetch} from '@/sanity/lib/live'
import {GAMES_LIST} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Game reviews',
}

export default async function GamesPage() {
  const {data} = await sanityFetch({query: GAMES_LIST})
  const items = (data ?? []) as GameCardItem[]

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Game reviews</h1>
      <p className="mt-3 max-w-2xl text-white/70">
        Recaps and box scores from Broncos games, season by season.
      </p>
      {items.length ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <GameCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-white/50">No game reviews published yet.</p>
      )}
    </div>
  )
}
