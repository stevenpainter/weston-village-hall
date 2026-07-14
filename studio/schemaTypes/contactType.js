import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact & Bookings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 15, description: 'Supports Markdown formatting.' }),
  ],
})
