import {gamePath} from '@/lib/slugify'

export type FeedCoverImage = {
  alt?: string | null
  asset?: {
    _id?: string
    url?: string | null
    metadata?: {
      lqip?: string | null
      dimensions?: {width?: number; height?: number}
    } | null
  } | null
}

export type FeedItem = {
  _id: string
  _type: 'news' | 'game'
  title: string | null
  sortDate?: string | null
  excerpt?: string | null
  coverImage?: FeedCoverImage | null
  slug?: string | null
  publishedAt?: string | null
  seasonYear?: number | null
  matchupSlug?: string | null
  awayTeam?: string | null
  homeTeam?: string | null
  gameDate?: string | null
}

export function isGameItem(item: FeedItem): boolean {
  return item._type === 'game' || Boolean(item.matchupSlug && item.seasonYear != null)
}

export function isNewsItem(item: FeedItem): boolean {
  return item._type === 'news' || Boolean(item.slug && !item.matchupSlug)
}

export function feedItemHref(item: FeedItem): string | null {
  if (isGameItem(item) && item.matchupSlug && item.seasonYear != null) {
    return gamePath(Number(item.seasonYear), item.matchupSlug)
  }
  if (item.slug) return `/news/${item.slug}`
  return null
}

export function feedItemDate(item: FeedItem): string | null | undefined {
  return item.sortDate ?? item.publishedAt
}

export function feedItemLabel(item: FeedItem): string {
  return isGameItem(item) ? 'Game review' : 'News'
}

export function feedItemMeta(item: FeedItem): string | null {
  if (isGameItem(item) && item.awayTeam && item.homeTeam) {
    return `${item.seasonYear} | ${item.awayTeam} @ ${item.homeTeam}`
  }
  return null
}

type NewsRow = {
  _id: string
  title: string | null
  slug?: string | null
  publishedAt?: string | null
  excerpt?: string | null
  coverImage?: FeedCoverImage | null
}

type GameRow = {
  _id: string
  title: string | null
  seasonYear?: number | null
  matchupSlug?: string | null
  awayTeam?: string | null
  homeTeam?: string | null
  gameDate?: string | null
  publishedAt?: string | null
  excerpt?: string | null
  coverImage?: FeedCoverImage | null
}

function toSortTime(iso: string | null | undefined) {
  if (!iso) return 0
  const t = new Date(iso).getTime()
  return Number.isFinite(t) ? t : 0
}

export function mergeHomeFeed(news: NewsRow[] | null | undefined, games: GameRow[] | null | undefined, limit: number) {
  const newsItems: FeedItem[] = (news ?? [])
    .filter((row) => row.slug && row.publishedAt)
    .map((row) => ({
      _type: 'news' as const,
      _id: row._id,
      title: row.title,
      slug: row.slug ?? null,
      publishedAt: row.publishedAt,
      sortDate: row.publishedAt,
      excerpt: row.excerpt,
      coverImage: row.coverImage,
    }))

  const gameItems: FeedItem[] = (games ?? [])
    .filter((row) => row.matchupSlug && row.seasonYear != null && row.publishedAt)
    .map((row) => ({
      _type: 'game' as const,
      _id: row._id,
      title: row.title,
      seasonYear: row.seasonYear ?? null,
      matchupSlug: row.matchupSlug ?? null,
      awayTeam: row.awayTeam ?? null,
      homeTeam: row.homeTeam ?? null,
      gameDate: row.gameDate,
      publishedAt: row.publishedAt,
      sortDate: row.publishedAt,
      excerpt: row.excerpt,
      coverImage: row.coverImage,
    }))

  return [...newsItems, ...gameItems]
    .sort((a, b) => toSortTime(b.sortDate) - toSortTime(a.sortDate))
    .slice(0, limit)
}
