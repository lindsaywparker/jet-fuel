const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(bodyParser.json());

app.locals.title = 'Jet Fuel';
app.locals.folders = {
  '37b4e2d82900d5e94b8da524fbeb33c0': 'Football',
  fd2b28331d3d461e015195931007a76c: 'Pi Phi',
  c5fd94950c06088e2163a923ba8c1535: 'Turing',
};
app.locals.links = {
  0: {
    linkLabel: 'two label',
    linkLong: 'two long link',
    linkShort: 'two short link',
    folderID: '37b4e2d82900d5e94b8da524fbeb33c0',
  },
  1: {
    label: 'one label',
    longLink: 'one long link',
    shortLink: 'one short link',
    folderID: 'fd2b28331d3d461e015195931007a76c',
  },
};


// 'api/v1/folders'             with GET             view folders
app.get('/api/v1/folders', (request, response) => {
  response.status(200).json(app.locals.folders);
});

//                              with POST            create folder
app.post('/api/v1/folders', (request, response) => {
  const { folderName } = request.body;
  const id = md5(folderName.toLowerCase());

  if (!folderName) { return response.status(422).send('Must include a folder name'); }

  app.locals.folders[id] = folderName;

  return response.status(201).json(app.locals.folders);
});


// 'api/v1/folders/:id/links'   with GET             view links in a folder
app.get('/api/v1/folders/:folderID/links', (request, response) => {
  const { folderID } = request.params;
  const links = Object.keys(app.locals.links)
    .filter(linkID => app.locals.links[linkID].folderID === folderID)
    .map(linkID => app.locals.links[linkID]);

  response.status(200).json(links);
});

// '/api/v1/links'              with POST            create link in a folder
app.post('/api/v1/links', (request, response) => {
  const { linkLabel, linkLong, folderName } = request.body;
  const linkID = md5(linkLong);

  if (!linkLabel || !linkLong || !folderName) {
    return response.status(422).send('Must include a label, link, and folder');
  }

  const folderID = md5(folderName.toLowerCase());
  const linkShort = 'hi.im/a/short/link/kindof';

  app.locals.links[linkID] = {
    linkLabel,
    linkLong,
    linkShort,
    folderID,
  };

  return response.status(201).json(app.locals.links[linkID]);
});


app.listen(app.get('port'), () => {
  console.log(`'${app.locals.title}' is running on http://localhost:${app.get('port')}.`);
});