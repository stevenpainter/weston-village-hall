import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Event Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'date', title: 'Start Date & Time', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'endDate', title: 'End Date & Time', type: 'datetime' }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          'Coffee Morning',
          'Quiz Night',
          'Pub Night',
          'Exercise Class',
          'Craft Group',
          'Private Hire',
          'Other',
        ],
      },
    }),
    defineField({ name: 'body', title: 'Description', type: 'text', rows: 6, description: 'Supports Markdown formatting.' }),
    defineField({
      name: 'contact',
      title: 'Contact / Booking',
      type: 'string',
      description: 'Email address or phone number for bookings or enquiries.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
  ],
  orderings: [
    {
      title: 'Date, new first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'date' },
    prepare({ title, date }) {
      return { title, subtitle: date ? new Date(date).toLocaleString('en-GB') : undefined }
    },
  },
})
