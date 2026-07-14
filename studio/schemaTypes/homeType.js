import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for people who cannot see it. Required if an image is set.',
        }),
      ],
    }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 10, description: 'Supports Markdown formatting.' }),
  ],
  preview: {
    select: { title: 'title', media: 'heroImage' },
  },
})
