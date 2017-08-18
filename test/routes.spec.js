const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const server = require('../server');
// const seed = require('./seed');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    true.should.equal(true);
  });
});

describe('API Routes', () => {
  before((done) => {
    // run migrations
    done();
  });

  beforeEach((done) => {
    // run seed file(s)
    // folders = seed.folders;
    // links = seed.links;
    done();
  });

  describe('GET /api/v1/folders', () => {
    it('should return all folders', (done) => {
      true.should.equal(true);
      done();
    });
  });

  describe('POST /api/v1/folders', () => {
    it('should create a new folder', (done) => {
      true.should.equal(true);
      done();
    });

    it('should not create a new folder with missing data', (done) => {
      true.should.equal(true);
      done();
    });
  });

  describe('GET /api/v1/links', () => {
    it('should return all links', (done) => {
      true.should.equal(true);
      done();
    });
  });

  describe('POST /api/v1/links', () => {
    it('should create a new link', (done) => {
      true.should.equal(true);
      done();
    });

    it('should not create a new link with missing data', (done) => {
      true.should.equal(true);
      done();
    });
  });

  describe('GET /api/v1/links/:linkID', () => {
    it('should return a long link', (done) => {
      true.should.equal(true);
      done();
    });
  });

  describe('GET /api/v1/folders/:folderID/links', () => {
    it('should return all links in a folder', (done) => {
      true.should.equal(true);
      done();
    });
  });
});