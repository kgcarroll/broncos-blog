import {defineArrayMember, defineField, defineType} from 'sanity'
import {buildMatchupSlug} from '../../lib/slugify'
import {bodyField, coverField} from './blocks'

const slugifyMatchup = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const game = defineType({
  name: 'game',
  title: 'Game review',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'seasonYear',
      title: 'Season year',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1960).max(2100),
      description: 'Used in the URL: /games/{year}/away-vs-home',
    }),
    defineField({
      name: 'awayTeam',
      title: 'Away team',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Visiting team (listed first in the URL slug).',
    }),
    defineField({
      name: 'homeTeam',
      title: 'Home team',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Home team (listed second in the URL slug).',
    }),
    defineField({
      name: 'matchupSlug',
      title: 'URL slug',
      type: 'slug',
      description: 'Format: away-vs-home (e.g. chiefs-vs-broncos). Auto-generated from team names.',
      options: {
        source: (doc: {awayTeam?: string; homeTeam?: string}) =>
          buildMatchupSlug(doc?.awayTeam || '', doc?.homeTeam || ''),
        slugify: slugifyMatchup,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gameDate',
      title: 'Game date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({name: 'excerpt', type: 'text', rows: 3}),
    coverField(),
    defineField({
      name: 'boxScore',
      title: 'Box score',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'quarters',
          title: 'Quarter scores',
          type: 'array',
          description: 'Enter scores for all four quarters (away team rows match the Away team field above).',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'quarterScore',
              fields: [
                defineField({
                  name: 'away',
                  title: 'Away',
                  type: 'number',
                  validation: (Rule) => Rule.required().min(0).integer(),
                }),
                defineField({
                  name: 'home',
                  title: 'Home',
                  type: 'number',
                  validation: (Rule) => Rule.required().min(0).integer(),
                }),
              ],
              preview: {
                select: {away: 'away', home: 'home'},
                prepare({away, home}) {
                  return {title: `Away ${away ?? 0} - Home ${home ?? 0}`}
                },
              },
            }),
          ],
          validation: (Rule) =>
            Rule.required().length(4).error('Add exactly four quarters (Q1 through Q4).'),
          initialValue: () => [
            {_type: 'quarterScore', away: 0, home: 0},
            {_type: 'quarterScore', away: 0, home: 0},
            {_type: 'quarterScore', away: 0, home: 0},
            {_type: 'quarterScore', away: 0, home: 0},
          ],
        }),
      ],
    }),
    bodyField(),
  ],
  orderings: [
    {
      title: 'Published date, newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Game date, newest',
      name: 'gameDateDesc',
      by: [{field: 'gameDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      seasonYear: 'seasonYear',
      awayTeam: 'awayTeam',
      homeTeam: 'homeTeam',
      media: 'coverImage',
      gameDate: 'gameDate',
    },
    prepare({title, seasonYear, awayTeam, homeTeam, media, gameDate}) {
      const matchup = awayTeam && homeTeam ? `${awayTeam} @ ${homeTeam}` : ''
      const when = gameDate ? new Date(gameDate).toLocaleDateString() : ''
      return {
        title,
        subtitle: [seasonYear, matchup, when].filter(Boolean).join(' | '),
        media,
      }
    },
  },
})
