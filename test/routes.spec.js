const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const server = require('../server');
const config = require('../knexfile.js').test;
const knex = require('knex')(config);


chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.include('JET FUEL');
        response.res.text.should.include('URL Shortener');
        response.res.text.should.include('new-folder-input');
        response.res.text.should.include('new-link-label');
        response.res.text.should.include('new-link-long');
        response.res.text.should.include('folder-dropdown');
        done();
      });
  });
});

describe('API Routes', () => {
  before((done) => {
    knex.migrate.latest()
      .then(() => done());
  });

  beforeEach((done) => {
    knex.seed.run()
      .then(() => done());
  });

  describe('GET /api/v1/folders', () => {
    it('should return all folders', (done) => {
      chai.request(server)
        .get('/api/v1/folders')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          // response.body.should.be.a('array');
          response.body.should.be.a('string');
          // response.body.length.should.equal(3);
          response.body.length.should.equal(5);
          response.body[0].should.have.property('folderName');
          response.body[0].folderName.should.equal('Football');
          response.body[1].folderName.should.equal('Michigan');
          response.body[2].folderName.should.equal('Turing');
          done();
        });
    });
  });

  describe('POST /api/v1/folders', () => {
    it('should create a new folder', (done) => {
      chai.request(server)
        .post('/api/v1/folders')
        .send({
          id: 4,
          folderName: 'Cute Dogs',
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(4);

          chai.request(server)
            .get('/api/v1/folders')
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(4);
              response.body[3].folderName.should.equal('Cute Dogs');
              done();
            });
        });
    });

    it('should not create a new folder with missing data', (done) => {
      chai.request(server)
        .post('/api/v1/folders')
        .send({})
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Missing required folderName parameter');
          done();
        });
    });
  });

  describe('GET /api/v1/links', () => {
    it('should return all links', (done) => {
      chai.request(server)
        .get('/api/v1/links')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('linkLabel');
          response.body[0].linkLabel.should.equal('Schedule');
          response.body[0].should.have.property('linkLong');
          response.body[0].linkLong.should.equal('http://mgoblue.com/schedule.aspx?path=football');
          response.body[0].should.have.property('linkShort');
          response.body[0].linkShort.should.equal('jetfuel.com/b2b26273');
          response.body[0].should.have.property('folderID');
          response.body[0].folderID.should.equal(1);
          done();
        });
    });
  });

  describe('POST /api/v1/links', () => {
    it('should create a new link', (done) => {
      chai.request(server)
        .post('/api/v1/links')
        .send({
          id: 4,
          linkLabel: 'Lessons',
          linkLong: 'http://frontend.turing.io/lessons/',
          folderID: 3,
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
          response.body.should.have.property('linkLabel');
          response.body.linkLabel.should.equal('Lessons');
          response.body.should.have.property('linkLong');
          response.body.linkLong.should.equal('http://frontend.turing.io/lessons/');
          response.body.should.have.property('linkShort');
          response.body.linkShort.should.equal('jetfuel.com/1d3eac87');
          response.body.should.have.property('folderID');
          response.body.folderID.should.equal(3);

          chai.request(server)
            .get('/api/v1/links')
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(4);
              response.body[3].should.have.property('linkLabel');
              response.body[3].linkLabel.should.equal('Lessons');
              response.body[3].should.have.property('linkLong');
              response.body[3].linkLong.should.equal('http://frontend.turing.io/lessons/');
              response.body[3].should.have.property('linkShort');
              response.body[3].linkShort.should.equal('jetfuel.com/1d3eac87');
              response.body[3].should.have.property('folderID');
              response.body[3].folderID.should.equal(3);
              done();
            });
        });
    });

    it('should not create a new link with missing data', (done) => {
      chai.request(server)
        .post('/api/v1/links')
        .send({
          id: 4,
          linkLong: 'http://frontend.turing.io/lessons/‎',
          folderID: 3,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Missing required linkLabel parameter');
          done();
        });
    });
  });

  describe('GET /api/v1/links/:linkID', () => {
    it('should return a long link', (done) => {
      chai.request(server)
        .get('/api/v1/links/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('string');
          response.body.should.equal('http://mgoblue.com/schedule.aspx?path=football');
          done();
        });
    });
  });

  describe('GET /api/v1/folders/:folderID/links', () => {
    it('should return all links in a folder', (done) => {
      chai.request(server)
        .get('/api/v1/folders/1/links')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('linkLabel');
          response.body[0].linkLabel.should.equal('Schedule');
          response.body[0].should.have.property('linkLong');
          response.body[0].linkLong.should.equal('http://mgoblue.com/schedule.aspx?path=football');
          response.body[0].should.have.property('linkShort');
          response.body[0].linkShort.should.equal('jetfuel.com/b2b26273');
          response.body[0].should.have.property('folderID');
          response.body[0].folderID.should.equal(1);
          done();
        });
    });
  });
});