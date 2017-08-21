// Assignment: For each line of the server file, put a comment on the line that
//   explains what the line below is doing. Be as explicit as necessary.

// Express framework enables simpler and more organized use of Node.js
const express = require('express');
// Body-parser is a middleware package that parses incoming request bodies
const bodyParser = require('body-parser');
// Short-hash is used to create the short link
const shortHash = require('short-hash');
// Create a new Express server named 'app'
const app = express();

// DATABASE CONFIGURATION
// Assign the server title for logging on `app.listen`
app.locals.title = 'Jet Fuel';
// If NODE_ENV value is not defined, set environment to 'development'
// This comes in handy for testing and pushing to production
const environment = process.env.NODE_ENV || 'development';
// Establish client, connection, migrations, etc based on the environment
const configuration = require('./knexfile')[environment];
// Establish a new Postgres database using knex as the query builder
const database = require('knex')(configuration);

// Establish which port the server should run on, 3000 unless the port is set
//   elsewhere (like production)
app.set('port', process.env.PORT || 3000);

// Serve the contents of the file 'public' so they're available to be loaded
app.use(express.static('public'));
// Apply bodyParser as middleware to parse json request bodies
app.use(bodyParser.json());
// Only parse 'urlencoded' bodies where 'Content-type' header matches 'type'
app.use(bodyParser.urlencoded({ extended: true }));

// ENDPOINTS
// Listen for GET requests to 'api/v1/folders'
app.get('/api/v1/folders', (request, response) => {
  // Select all of the entries in the 'folders' database
  database('folders').select()
    // Once those are available, take those folders...
    .then((folders) => {
      // and send them back as json with an 'OK' status code
      response.status(200).json(folders);
    })
    // If there's an error...
    .catch((error) => {
      // send the error back as json with an 'Internal Server Error' status code
      response.status(500).json({ error });
    });
});

// Listen for POST requests to '/api/v1/folders'
app.post('/api/v1/folders', (request, response) => {
  // Set the variable `newFolder` to the contents of the POST request body
  const newFolder = request.body;

  // Loop through each of the request's required parameters
  for (const requiredParameter of ['folderName']) {
    // If that parameter is not provided in the request body...
    if (!newFolder[requiredParameter]) {
      // return an 'Unprocessable Entity' status code...
      return response.status(422).json({
        // and an error message as json
        error: `Missing required ${requiredParameter} parameter`,
      });
    }
  }

  // Otherwise, if all required parameters are present, insert the new folder
  //   into the 'folders' database and return the new folders 'id'
  database('folders').insert(newFolder, 'id')
    // Once the new folder is available, take that folder id...
    .then((folder) => {
      // And send it back as json with 'Created' status code
      response.status(201).json({ id: folder[0] });
    })
    // If there's an error...
    .catch((error) => {
      // send the error back as json with an 'Internal Server Error' status code
      response.status(500).json({ error });
    });
});

// Listen for GET requests to 'api/v1/links'
app.get('/api/v1/links', (request, response) => {
  // Select all of the entries in the 'links' database
  database('links').select()
    // Once those are available, take those links...
    .then((links) => {
      // and send them back as json with an 'OK' status code
      response.status(200).json(links);
    })
    // If there's an error...
    .catch((error) => {
      // send the error back as json with an 'Internal Server Error' status code
      response.status(500).json({ error });
    });
});

// Listen for POST requests to '/api/v1/links'
app.post('/api/v1/links', (request, response) => {
  // Set the variable `newLink` to the contents of the POST request body
  const newLink = request.body;

  // Loop through each of the request's required parameters
  for (const requiredParameter of ['linkLabel', 'linkLong', 'folderID']) {
    // If that parameter is not provided in the request body...
    if (!newLink[requiredParameter]) {
      // return an 'Unprocessable Entity' status code...
      return response.status(422).json({
        // and an error message as json
        error: `Missing required ${requiredParameter} parameter`,
      });
    }
  }

  // Otherwise, if all required parameters are present, use the short-hash
  //   module to return a short string and assign this short URL to the
  //   'linkShort' key of the newLink object
  newLink.linkShort = `jetfuel.com/${shortHash(newLink.linkLong)}`;

  // Insert the new link into the 'links' database and return the new link
  database('links').insert(newLink, '*')
    // Once the new link is available, take that link...
    .then((link) => {
      // And send it back as json with 'Created' status code
      response.status(201).json(link[0]);
    })
    // If there's an error...
    .catch((error) => {
      // send the error back as json with an 'Internal Server Error' status code
      response.status(500).json({ error });
    });
});

// Listen for GET requests to '/api/v1/links/:linkID'
app.get('/api/v1/links/:linkID', (request, response) => {
  // Select the links where their ID is equivalent to the ID in the route
  database('links').where('id', request.params.linkID).select()
    // Once that link is available (since there will only be one with this ID),
    //   take that link...
    .then((link) => {
      // and send it back as json with an 'OK' status code
      response.status(200).json(link[0].linkLong);
    })
    // If there's an error
    .catch((error) => {
      // send the error back as json with an 'Internal Server Error' status code
      response.status(500).json({ error });
    });
});

// Listen for GET requests to 'api/v1/folders/:id/links'
app.get('/api/v1/folders/:folderID/links', (request, response) => {
  // Select the links where their folderID is equivalent to the folderID in the route
  database('links').where('folderID', request.params.folderID).select()
  // Once those links are available (could be any number or zero), take those links
    .then((links) => {
      // and send them back as json with an 'OK' status code
      response.status(200).json(links);
    })
    // If there's an error
    .catch((error) => {
      // send the error back as json with an 'Internal Server Error' status code
      response.status(500).json({ error });
    });
});

// Listen for connections on the port specified on line 26
app.listen(app.get('port'), () => {
  // When a connection is established, console log the message below
  console.log(`'${app.locals.title}' is running on http://localhost:${app.get('port')}.`);
});

// Make the Express server available for testing
module.exports = app;