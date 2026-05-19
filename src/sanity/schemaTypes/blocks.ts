import {defineField} from 'sanity'

export const coverField = () =>
  defineField({
    name: 'coverImage',
    title: 'Cover image',
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        type: 'string',
        title: 'Alt text',
        validation: (Rule) => Rule.required(),
      }),
    ],
  })

export const bodyField = () =>
  defineField({
    name: 'body',
    title: 'Body',
    type: 'array',
    of: [
      {
        type: 'block',
        styles: [
          {title: 'Normal', value: 'normal'},
          {title: 'H2', value: 'h2'},
          {title: 'H3', value: 'h3'},
          {title: 'Quote', value: 'blockquote'},
        ],
        lists: [
          {title: 'Bullet', value: 'bullet'},
          {title: 'Number', value: 'number'},
        ],
        marks: {
          decorators: [
            {title: 'Strong', value: 'strong'},
            {title: 'Emphasis', value: 'em'},
          ],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [{name: 'href', type: 'url', title: 'URL'}],
            },
          ],
        },
      },
      {
        type: 'image',
        options: {hotspot: true},
        fields: [
          defineField({
            name: 'alt',
            type: 'string',
            title: 'Alt text',
            validation: (Rule) => Rule.required(),
          }),
          defineField({name: 'caption', type: 'string', title: 'Caption'}),
        ],
      },
    ],
  })
