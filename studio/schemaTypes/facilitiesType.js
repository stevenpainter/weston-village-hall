import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'facilities',
  title: 'Facilities & Hire Rates',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 20, description: 'Supports Markdown formatting.' }),
  ],
})
