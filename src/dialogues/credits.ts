export const creditsDialogue = {
  start: {
    text: 'credits.start.text',
    responses: [
      { text: 'credits.start.q_creator', nextId: 'about_creator' },
      { text: 'credits.start.q_mobius', nextId: 'about_mobius' },
      { text: 'credits.start.q_end', nextId: 'goodbye' }
    ]
  },
  about_creator: {
    text: 'credits.about_creator.text',
    responses: [
      { text: 'credits.about_creator.q_insist', nextId: 'about_creator_insist' },
      { text: 'credits.about_creator.q_back', nextId: 'start' },
      { text: 'credits.start.q_end', nextId: 'goodbye' }
    ]
  },
  about_creator_insist: {
    text: 'credits.about_creator_insist.text',
    responses: [
      { text: 'credits.about_creator.q_back', nextId: 'start' },
      { text: 'credits.start.q_end', nextId: 'goodbye' }
    ]
  },
  about_mobius: {
    text: 'credits.about_mobius.text',
    responses: [],
    autoNext: 'about_mobius_2'
  },
  about_mobius_2: {
    text: 'credits.about_mobius_2.text',
    responses: [
      { text: 'credits.about_creator.q_back', nextId: 'start' },
      { text: 'credits.start.q_end', nextId: 'goodbye' }
    ]
  },
  goodbye: {
    text: 'credits.goodbye.text',
    responses: []
  }
};