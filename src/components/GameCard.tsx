import Link from 'next/link'
import {SanityImage} from '@/components/SanityImage'
import {formatDate} from '@/lib/formatDate'
import {gamePath} from '@/lib/slugify'

export type GameCardItem = {
  _id: string
  title: string | null
  seasonYear: number | null
  matchupSlug: string | null
  awayTeam: string | null
  homeTeam: string | null
  gameDate?: string | null
  publishedAt?: string | null
  excerpt?: string | null
  coverImage?: {
    alt?: string | null
    asset?: {
      _id?: string
      url?: string | null
      metadata?: {
        lqip?: string | null
        dimensions?: {width?: number; height?: number}
      } | null
    } | null
  } | null
}

export function GameCard({item}: {item: GameCardItem}) {
  if (!item.matchupSlug || item.seasonYear == null) return null
  const href = gamePath(item.seasonYear, item.matchupSlug)
  const date = formatDate(item.publishedAt ?? item.gameDate)
  const matchup =
    item.awayTeam && item.homeTeam ? `${item.awayTeam} @ ${item.homeTeam}` : null

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-white/10 bg-white/5 transition hover:border-broncos-orange/50">
      <Link href={href} className="relative aspect-[16/10] w-full overflow-hidden bg-broncos-navy">
        {item.coverImage?.asset?._id ? (
          <SanityImage
            value={item.coverImage}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-white/40">No image</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-broncos-orange">
          {item.seasonYear}
          {matchup ? ` | ${matchup}` : ''}
        </p>
        {date ? (
          <time className="text-xs text-white/50" dateTime={item.publishedAt ?? item.gameDate ?? undefined}>
            {date}
          </time>
        ) : null}
        <Link href={href} className="outline-none focus-visible:ring-2 focus-visible:ring-broncos-orange/50">
          <h2 className="line-clamp-2 text-base font-semibold text-white group-hover:text-broncos-orange">
            {item.title}
          </h2>
        </Link>
        {item.excerpt ? <p className="line-clamp-2 text-sm text-white/70">{item.excerpt}</p> : null}
      </div>
    </article>
  )
}
