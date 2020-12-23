export var users = [
  {
    name: 'Joe Biden',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxBQF3-OpG82AZOw8GM5CZ1eMlSH9-hK7wUQ&usqp=CAU',
    comment: 'Make America great again!!',
    datetime: new Date('2020-11-24T09:09:00'),
  },
  {
    name: 'Emmanuel Macron',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Emmanuel_Macron_%28cropped%29.jpg/220px-Emmanuel_Macron_%28cropped%29.jpg',
    comment: "Mes concitoyen(ne)s, l'heure est grave...",
    datetime: new Date('2020-02-24T15:00:00'),
  },
  {
    name: 'Donald Trump',
    avatar:
      'https://www.challenges.fr/assets/img/2018/05/28/cover-r4x3w1000-5b0fbf7445ff2-trump-annonce-l-arrivee-d-emissaires-us-en-coree-du-nord.jpg',
    comment: 'This election is a fraud!!',
    datetime: new Date('2020-11-23T15:00:00'),
  },
  {
    name: 'Bruce Lee',
    avatar:
      'https://www.jeetkunedoconcept.fr/wp-content/uploads/sites/11/2018/08/bruce-lee-4-1024x576.jpg',
    comment: 'Be water, my friend.',
    datetime: new Date('1972-11-24T12:30:00'),
  },
  {
    name: 'John Cena',
    avatar:
      'https://i.kym-cdn.com/entries/icons/facebook/000/007/797/john-cena-missing-777x437.jpg',
    comment: "You can't see me!!",
    datetime: new Date('2019-08-31T15:00:00'),
  },
  {
    name: 'Dwayne "The Rock" Johnson',
    avatar:
      'https://images.ladbible.com/resize?type=jpeg&url=http://beta.ems.ladbiblegroup.com/s3/content/a87d98d35f68c2fc94b0604a44d2e0dc.png&quality=70&width=720&aspectratio=16:9&extend=white',
    comment: 'If You Smell, What The Rock Is Cooking',
    datetime: new Date('2018-06-07T15:00:00'),
  },
  {
    name: 'Uncle Roger',
    avatar:
      'https://monodramatic.com/wp-content/uploads/2020/09/uncle_roger_reaction_rice_bbc_%C2%A9uncleroger_youtube_video-850x567.jpg',
    comment: "Aiyaaaa!! That's just disgusting!!",
    datetime: new Date('2020-11-25T09:09:00'),
  },
  {
    name: 'Gordon Ramsay',
    avatar:
      'https://pyxis.nymag.com/v1/imgs/8d7/8d1/a6b94063a43171a380fb9c6b1c4da37f8f-20-gordon-ramsay.rsquare.w1200.jpg',
    comment: "Oh jesus!! THAT'S F******* RAWWW!!!",
    datetime: new Date('2020-12-04T15:00:00'),
  },
  // more users here
]

export var chatHistory = [
  {
    chatId: 1,
    owners: ['Test1', 'Joe Biden'],
    messages: [
      {
        from: 'Test1',
        to: 'Joe Biden',
        content: 'Hello M. President!!',
        datetime: new Date('2020-12-04T15:00:00'),
      },
      {
        from: 'Joe Biden',
        to: 'Test1',
        content: 'Hello!!',
        datetime: new Date('2020-12-04T15:02:00'),
      },
    ],
  },
  {
    chatId: 2,
    owners: ['Test1', 'Emmanuel Macron'],
    messages: [
      {
        from: 'Test1',
        to: 'Emmanuel Macron',
        content: 'Hello!!',
        datetime: new Date('2020-12-04T15:00:00'),
      },
    ],
  },
]
