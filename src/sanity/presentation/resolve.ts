import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    news: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/news/${doc?.slug}`,
          },
          {title: 'News', href: '/news'},
          {title: 'Home', href: '/'},
        ],
      }),
    }),
    siteSettings: defineLocations({
      select: {
        title: 'title',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Site settings',
            href: '/',
          },
        ],
      }),
    }),
  },
}
