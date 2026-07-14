export const structure = (S) =>
  S.list()
    .title('Weston Village Hall')
    .items([
      S.listItem()
        .title('Home Page')
        .child(S.document().schemaType('home').documentId('home')),
      S.listItem()
        .title('About')
        .child(S.document().schemaType('about').documentId('about')),
      S.listItem()
        .title('Facilities & Hire Rates')
        .child(S.document().schemaType('facilities').documentId('facilities')),
      S.listItem()
        .title('Contact & Bookings')
        .child(S.document().schemaType('contact').documentId('contact')),
      S.listItem()
        .title('Events — Regular Activities')
        .child(S.document().schemaType('eventsIndex').documentId('eventsIndex')),
      S.divider(),
      S.listItem()
        .title('Events')
        .child(S.documentTypeList('event').title('Events')),
    ])
