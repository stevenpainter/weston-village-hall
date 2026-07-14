import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'eventsIndex',
  title: 'Events — Regular Activities',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      type: 'text',
      rows: 5,
      description: 'Describe regular weekly or monthly activities here. One-off events are managed separately under Events.',
    }),
    defineField({
      name: 'activities',
      title: 'Regular Activities',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'activity',
          fields: [
            defineField({ name: 'name', title: 'Activity name', type: 'string' }),
            defineField({ name: 'schedule', title: 'Schedule', type: 'string', description: 'e.g. Every Tuesday, 10am–12pm' }),
            defineField({ name: 'cost', title: 'Cost', type: 'string' }),
            defineField({ name: 'body', title: 'Description', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'schedule' },
          },
        }),
      ],
    }),
  ],
})
