const folders = [
  { id: 1, folderName: 'Football' },
  { id: 2, folderName: 'Michigan' },
  { id: 3, folderName: 'Turing' },
];

const links = [
  {
    id: 1,
    linkLabel: 'Schedule',
    linkLong: 'http://mgoblue.com/schedule.aspx?path=football',
    linkShort: 'jetfuel.com/b2b26273',
    folderID: 1,
  },
  {
    id: 2,
    linkLabel: 'Where to stay',
    linkLong: 'http://www.airbnb.com/Michigan‎',
    linkShort: 'jetfuel.com/b2b26654',
    folderID: 2,
  },
  {
    id: 3,
    linkLabel: 'Alums in the NFL',
    linkLong: 'http://www.mgoblue.com/sports/2017/6/16/sports-m-footbl-archive-in-the-nfl-html.aspx',
    linkShort: 'jetfuel.com/b2b13554',
    folderID: 1,
  },
];


exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('links').del()
    .then(() => {
      return knex('folders').del();
    })
    .then(() => {
      // Inserts seed entries
      return Promise.all(folders.map((folder) => {
        return knex('folders').insert(folder);
      }));
    })
    .then(() => {
      return Promise.all(links.map((link) => {
        return knex('links').insert(link);
      }));
    });
};
