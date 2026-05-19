import Link from 'next/link'
import {SanityImage} from '@/components/SanityImage'
import {formatDate} from '@/lib/formatDate'
import type {NewsCardItem} from '@/components/NewsCard'

const HERO_COUNT = 4

function HeroTile({
  item,
  priority,
  className,
  titleClassName,
}: {
  item: NewsCardItem
  priority?: boolean
  className?: string
  titleClassName?: string
}) {
  if (!item.slug) return null
  const href = `/news/${item.slug}`
  const date = formatDate(item.publishedAt)

  return (
    <Link
      href={href}
      className={`group relative block min-h-[220px] overflow-hidden bg-broncos-navy outline-none focus-visible:ring-2 focus-visible:ring-broncos-orange focus-visible:ring-offset-2 focus-visible:ring-offset-broncos-navy ${className ?? ''}`}
    >
      {item.coverImage?.asset?._id ? (
        <SanityImage
          value={item.coverImage}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-broncos-navy to-black" aria-hidden />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" aria-hidden />

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        {date ? (
          <time
            className="text-xs font-semibold uppercase tracking-widest text-broncos-orange"
            dateTime={item.publishedAt ?? undefined}
          >
            {date}
          </time>
        ) : null}
        <h2
          className={`mt-1 font-bold leading-snug text-white group-hover:text-broncos-orange ${titleClassName ?? 'text-lg md:text-xl'}`}
        >
          {item.title}
        </h2>
      </div>
    </Link>
  )
}

export function NewsHero({items}: {items: NewsCardItem[]}) {
  const heroItems = items.filter((item) => item.slug).slice(0, HERO_COUNT)

  if (!heroItems.length) {
    return null
  }

  const [featured, ...rest] = heroItems

  return (
    <section className="grid grid-cols-1 gap-1 lg:grid-cols-3 lg:grid-rows-2">
      <HeroTile
        item={featured}
        priority
        className="min-h-[300px] lg:col-span-2 lg:row-span-2 lg:min-h-[440px]"
        titleClassName="text-2xl md:text-3xl lg:text-4xl"
      />
      {rest.map((item) => (
        <HeroTile
          key={item._id}
          item={item}
          className="min-h-[200px] lg:min-h-[218px]"
          titleClassName="text-base md:text-lg"
        />
      ))}
    </section>
  )
}
