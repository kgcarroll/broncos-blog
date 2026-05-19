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
