import Link from 'next/link'
import {SanityImage} from '@/components/SanityImage'
import {formatDate} from '@/lib/formatDate'

export type NewsCardItem = {
  _id: string
  title: string | null
  slug: string | null
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

export function NewsCard({item}: {item: NewsCardItem}) {
  if (!item.slug) return null
  const href = `/news/${item.slug}`
  const date = formatDate(item.publishedAt)

  return (
    <article className="group flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-sm transition hover:border-broncos-orange/50">
      <Link href={href} className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-broncos-navy">
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
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
        {date ? (
          <time
            className="text-xs tabular-nums uppercase tracking-wide text-broncos-orange"
            dateTime={item.publishedAt ?? undefined}
          >
            {date}
          </time>
        ) : null}
        <Link href={href} className="outline-none focus-visible:ring-2 focus-visible:ring-broncos-orange/50">
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-white group-hover:text-broncos-orange">
            {item.title}
          </h2>
        </Link>
        {item.excerpt ? <p className="line-clamp-3 text-sm text-white/70">{item.excerpt}</p> : null}
      </div>
    </article>
  )
}
