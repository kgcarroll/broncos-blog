import {GameCard, type GameCardItem} from '@/components/GameCard'
import {NewsCard, type NewsCardItem} from '@/components/NewsCard'
import {isGameItem, type FeedItem} from '@/lib/feed'

export function FeedCard({item}: {item: FeedItem}) {
  if (isGameItem(item)) {
    const game: GameCardItem = {
      _id: item._id,
      title: item.title,
      seasonYear: item.seasonYear ?? null,
      matchupSlug: item.matchupSlug ?? null,
      awayTeam: item.awayTeam ?? null,
      homeTeam: item.homeTeam ?? null,
      gameDate: item.gameDate,
      publishedAt: item.publishedAt,
      excerpt: item.excerpt,
      coverImage: item.coverImage,
    }
    return <GameCard item={game} />
  }

  const news: NewsCardItem = {
    _id: item._id,
    title: item.title,
    slug: item.slug ?? null,
    publishedAt: item.publishedAt,
    excerpt: item.excerpt,
    coverImage: item.coverImage,
  }
  return <NewsCard item={news} />
}
