import {defineField, defineType} from 'sanity'

export const scheduleWeek = defineType({
  name: 'scheduleWeek',
  title: 'Schedule week',
  type: 'object',
  fields: [
    defineField({
      name: 'weekNumber',
      title: 'Week',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(18),
    }),
    defineField({
      name: 'isBye',
      title: 'Bye week',
      type: 'boolean',
      initialValue: false,
      description: 'No game this week. Only one bye week per season.',
    }),
    defineField({
      name: 'opponent',
      title: 'Opponent',
      type: 'string',
      hidden: ({parent}) => Boolean((parent as {isBye?: boolean})?.isBye),
    }),
    defineField({
      name: 'isHome',
      title: 'Broncos home game',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}) => Boolean((parent as {isBye?: boolean})?.isBye),
    }),
    defineField({
      name: 'gameDate',
      title: 'Kickoff',
      type: 'datetime',
      hidden: ({parent}) => Boolean((parent as {isBye?: boolean})?.isBye),
    }),
    defineField({
      name: 'tvNetwork',
      title: 'TV / streaming',
      type: 'string',
      hidden: ({parent}) => Boolean((parent as {isBye?: boolean})?.isBye),
    }),
    defineField({
      name: 'gameReview',
      title: 'Game review',
      type: 'reference',
      to: [{type: 'game'}],
      hidden: ({parent}) => Boolean((parent as {isBye?: boolean})?.isBye),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      weekNumber: 'weekNumber',
      isBye: 'isBye',
      opponent: 'opponent',
      isHome: 'isHome',
    },
    prepare({weekNumber, isBye, opponent, isHome}) {
      if (isBye) {
        return {title: `Week ${weekNumber}`, subtitle: 'BYE'}
      }
      const prefix = isHome ? 'vs' : '@'
      return {
        title: `Week ${weekNumber}`,
        subtitle: opponent ? `${prefix} ${opponent}` : 'TBD',
      }
    },
  },
})
