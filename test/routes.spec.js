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

  // it('should a 404 for routes that don\'t exist', (done) => {
  //   
  // });
});

describe('API Routes', () => {
  before(() => {
    knex.migrate.latest()
      .then(done => done());
  });

  beforeEach(() => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(done => done());
          });
      });
  });

  describe('GET /api/v1/folders', () => {
    it('should return all folders', (done) => {
      chai.request(server)
        .get('/api/v1/folders')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          done();
        });
    });
  });

  describe('POST /api/v1/folders', () => {
    it.skip('should create a new folder', (done) => {
      true.should.equal(true);
      done();
    });

    it.skip('should not create a new folder with missing data', (done) => {
      true.should.equal(true);
      done();
    });
  });

  describe('GET /api/v1/links', () => {
    it.skip('should return all links', (done) => {
      true.should.equal(true);
      done();
    });
  });

  describe('POST /api/v1/links', () => {
    it.skip('should create a new link', (done) => {
      true.should.equal(true);
      done();
    });

    it.skip('should not create a new link with missing data', (done) => {
      true.should.equal(true);
      done();
    });
  });

  describe('GET /api/v1/links/:linkID', () => {
    it.skip('should return a long link', (done) => {
      true.should.equal(true);
      done();
    });
  });

  describe('GET /api/v1/folders/:folderID/links', () => {
    it.skip('should return all links in a folder', (done) => {
      true.should.equal(true);
      done();
    });
  });
});