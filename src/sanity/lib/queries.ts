import {defineQuery} from 'next-sanity'

export const SITE_SETTINGS = defineQuery(`*[_type == "siteSettings"][0]{
  title,
  description,
  logo{
    alt,
    asset->{
      _id,
      url,
      metadata{dimensions{width, height}, lqip}
    }
  }
}`)

const newsCardFields = `{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage{
    alt,
    asset->{
      _id,
      url,
      metadata{dimensions{width, height}, lqip}
    }
  }
}`

export const NEWS_LIST = defineQuery(`*[_type == "news"] | order(publishedAt desc) ${newsCardFields}`)

export const NEWS_LIST_LIMITED = defineQuery(
  `*[_type == "news"] | order(publishedAt desc)[0...$limit] ${newsCardFields}`,
)

export const NEWS_BY_SLUG = defineQuery(`*[_type == "news" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage{
    alt,
    asset->{
      _id,
      url,
      metadata{dimensions{width, height}, lqip}
    }
  },
  body
}`)

export const NEWS_SLUGS = defineQuery(
  `*[_type == "news" && defined(slug.current)]{"slug": slug.current}`,
)

const gameCardFields = `{
  _id,
  title,
  seasonYear,
  "matchupSlug": matchupSlug.current,
  awayTeam,
  homeTeam,
  gameDate,
  publishedAt,
  excerpt,
  coverImage{
    alt,
    asset->{
      _id,
      url,
      metadata{dimensions{width, height}, lqip}
    }
  }
}`

export const GAMES_LIST = defineQuery(
  `*[_type == "game"] | order(publishedAt desc) ${gameCardFields}`,
)

export const GAMES_LIST_LIMITED = defineQuery(
  `*[_type == "game" && defined(seasonYear) && defined(matchupSlug.current)] | order(publishedAt desc)[0...$limit] ${gameCardFields}`,
)

export const GAME_BY_PATH = defineQuery(`*[_type == "game" && seasonYear == $year && matchupSlug.current == $matchup][0]{
  _id,
  title,
  seasonYear,
  "matchupSlug": matchupSlug.current,
  awayTeam,
  homeTeam,
  gameDate,
  publishedAt,
  excerpt,
  coverImage{
    alt,
    asset->{
      _id,
      url,
      metadata{dimensions{width, height}, lqip}
    }
  },
  boxScore{
    quarters[]{away, home}
  },
  body
}`)

export const GAME_PATHS = defineQuery(
  `*[_type == "game" && defined(seasonYear) && defined(matchupSlug.current)]{
    "year": string(seasonYear),
    "matchup": matchupSlug.current
  }`,
)
