process.env.NODE_ENV = 'test';
const app = require('../server');
const seedTest = require('../seed/test.seed');
const expect = require('chai').expect;
const request = require('supertest')(app);
const mongoose = require('mongoose');

describe('/api', () => {
  let docs = {};
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(() => {
        return seedTest();
      })
      .then((data) => {
        docs = data;
        return docs;
      });
  });
  after(() => {
    mongoose.disconnect();
  });
  describe('/topics', () => {
    describe('/', () => {
      it('returns all topics', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(res => {
            expect(res.body.topics.length).to.equal(3);
          })
      });
    });
    describe('/:slug/articles', () => {
      it('returns all articles for a given topic', () => {
        return request
          .get('/api/topics/football/articles')
          .expect(200)
          .then(res => {
            expect(res.body.topic).to.equal('football');
            expect(res.body.articles.length).to.equal(1);
          })
      });
    });
  });
});