const express = require('express');
const bodyParser = require('body-parser');
const shortHash = require('short-hash');

const app = express();

// DATABASE CONFIGURATION
app.locals.title = 'Jet Fuel';
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

// const requireHTTPS = (req, res, next) => {
//   console.log(req.headers['x-forwarded-proto']);
//   const schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
//   console.log(schema);
//   if (schema === 'https') {
//     next();
//   } else {
//     res.redirect(`https://${req.headers.host}${req.url}`);
//   }
// };
// 
// app.use(requireHTTPS);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ENDPOINTS
app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then((folders) => {
      response.status(200).json(folders);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/folders', (request, response) => {
  const newFolder = request.body;

  for (const requiredParameter of ['folderName']) {
    if (!newFolder[requiredParameter]) {
      return response.status(422).json({
        error: `Missing required ${requiredParameter} parameter`,
      });
    }
  }

  database('folders').insert(newFolder, 'id')
    .then((folder) => {
      response.status(201).json({ id: folder[0] });
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/links', (request, response) => {
  database('links').select()
    .then((links) => {
      response.status(200).json(links);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/links', (request, response) => {
  const newLink = request.body;

  for (const requiredParameter of ['linkLabel', 'linkLong', 'folderID']) {
    if (!newLink[requiredParameter]) {
      return response.status(422).json({
        error: `Missing required ${requiredParameter} parameter`,
      });
    }
  }

  newLink.linkShort = `jetfuel.com/${shortHash(newLink.linkLong)}`;

  database('links').insert(newLink, '*')
    .then((link) => {
      response.status(201).json(link[0]);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/links/:linkID', (request, response) => {
  database('links').where('id', request.params.linkID).select()
    .then((link) => {
      response.status(200).json(link[0].linkLong);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/folders/:folderID/links', (request, response) => {
  database('links').where('folderID', request.params.folderID).select()
    .then((links) => {
      response.status(200).json(links);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`'${app.locals.title}' is running on http://localhost:${app.get('port')}.`);
});

module.exports = app;