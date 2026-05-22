import {defineArrayMember, defineField, defineType} from 'sanity'

const WEEK_COUNT = 18
const DEFAULT_BYE_WEEK = 10

const defaultWeeks = () =>
  Array.from({length: WEEK_COUNT}, (_, index) => {
    const weekNumber = index + 1
    return {
      _type: 'scheduleWeek',
      weekNumber,
      isBye: weekNumber === DEFAULT_BYE_WEEK,
      isHome: true,
    }
  })

export const seasonSchedule = defineType({
  name: 'seasonSchedule',
  title: 'Season schedule',
  type: 'document',
  fields: [
    defineField({
      name: 'seasonYear',
      title: 'Season year',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1960).max(2100),
      initialValue: new Date().getFullYear(),
    }),
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Schedule',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      description: 'Short line shown at the top of the schedule page.',
    }),
    defineField({
      name: 'byeWeek',
      title: 'Bye week number',
      type: 'number',
      description: 'Which week (1-18) is the bye. Default is week 10.',
      initialValue: DEFAULT_BYE_WEEK,
      validation: (Rule) => Rule.required().integer().min(1).max(WEEK_COUNT),
    }),
    defineField({
      name: 'weeks',
      title: 'Weeks (17 games, 18 calendar weeks)',
      type: 'array',
      of: [defineArrayMember({type: 'scheduleWeek'})],
      validation: (Rule) =>
        Rule.custom((weeks, context) => {
          const rows = (weeks ?? []) as {weekNumber?: number; isBye?: boolean}[]
          if (rows.length !== WEEK_COUNT) {
            return `Add exactly ${WEEK_COUNT} weeks (17 games plus one bye).`
          }

          const numbers = rows.map((row) => row.weekNumber)
          const unique = new Set(numbers)
          if (
            unique.size !== WEEK_COUNT ||
            numbers.some((n) => n == null || n < 1 || n > WEEK_COUNT)
          ) {
            return `Week numbers must be 1 through ${WEEK_COUNT} with no duplicates.`
          }

          const byeWeek = (context.document as {byeWeek?: number})?.byeWeek
          const byeRows = rows.filter((row) => row.isBye)
          if (byeRows.length !== 1) {
            return 'Mark exactly one week as the bye week.'
          }
          if (byeWeek != null && byeRows[0]?.weekNumber !== byeWeek) {
            return `The bye week row (week ${byeRows[0]?.weekNumber}) must match the bye week number (${byeWeek}).`
          }

          return true
        }),
      initialValue: defaultWeeks,
    }),
  ],
  preview: {
    select: {title: 'title', seasonYear: 'seasonYear', byeWeek: 'byeWeek'},
    prepare({title, seasonYear, byeWeek}) {
      return {
        title: title || 'Schedule',
        subtitle: [seasonYear, byeWeek ? `Bye week ${byeWeek}` : null].filter(Boolean).join(' | '),
      }
    },
  },
})
