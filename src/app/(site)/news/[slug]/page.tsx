import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import Link from 'next/link'
import {ArticleBody} from '@/components/ArticleBody'
import {SanityImage} from '@/components/SanityImage'
import {formatDate} from '@/lib/formatDate'
import {isSanityConfigured} from '@/lib/sanityConfigured'
import {sanityFetch} from '@/sanity/lib/live'
import {NEWS_BY_SLUG, NEWS_SLUGS} from '@/sanity/lib/queries'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  if (!isSanityConfigured()) return []
  try {
    const {data} = await sanityFetch({
      query: NEWS_SLUGS,
      perspective: 'published',
      stega: false,
    })
    return (data || []).map((row: {slug: string}) => ({slug: row.slug}))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: NEWS_BY_SLUG,
    params: {slug},
    stega: false,
  })
  if (!data) return {title: 'Not found'}
  return {
    title: data.title || 'News',
    description: data.excerpt || undefined,
  }
}

export default async function NewsArticlePage({params}: Props) {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: NEWS_BY_SLUG,
    params: {slug},
  })
  if (!data) notFound()

  const date = formatDate(data.publishedAt)

  return (
    <article>
      <Link href="/news" className="text-sm font-medium text-broncos-orange hover:underline">
        Back to all news
      </Link>
      {date ? (
        <time className="mt-4 block text-sm text-broncos-orange" dateTime={data.publishedAt ?? undefined}>
          {date}
        </time>
      ) : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">{data.title}</h1>
      {data.excerpt ? <p className="mt-4 text-lg text-white/80">{data.excerpt}</p> : null}
      {data.coverImage?.asset?._id ? (
        <div className="mt-8 overflow-hidden rounded-xl">
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
