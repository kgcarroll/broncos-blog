import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Site title',
      initialValue: 'Broncos News',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Tagline',
      rows: 2,
      initialValue: 'Unofficial Denver Broncos news and updates.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Optional logo for the header. Use a wide image with a transparent background.',
      options: {hotspot: false},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
  ],
})
