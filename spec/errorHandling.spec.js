process.env.NODE_ENV = 'test';
const app = require('../server');
const seedTest = require('../seed/test.seed');
const expect = require('chai').expect;
const request = require('supertest')(app);
const mongoose = require('mongoose');
const config = require('../config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;

describe.only('Error Handling', () => {
  let docs = {};
  beforeEach(() => {
    const p = mongoose.connection.readyState === 0 ? mongoose.connect(db) : Promise.resolve()

    return p
      .then(() => mongoose.connection.dropDatabase())
      .then(() => seedTest())
      .then((data) => {
        docs = data;
        return docs;
      });
  });
  after(() => {
    mongoose.disconnect();
  });
  describe('/articles', () => {
    it('returns error when page query is an invalid input', () => {
      return request
        .get('/api/articles?page=one')
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid page number. Page must be queried with a valid number.")
        })
    });
    it('returns error when limit query is an invalid input', () => {
      return request
        .get('/api/articles?limit=one')
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid limit. Limit must be queried with a valid number.")
        })
    });
    it('returns error when sort query is an invalid input', () => {
      return request
        .get('/api/articles?sort=recent')
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid sort query. Sort must be queried with a valid term; votes, comments, _id.")
        })
    });
  });
  describe('/articles/:article_id', () => {
    it('returns error when article id is an invalid input', () => {
      return request
        .get(`/api/articles/123`)
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid article id.")
        })
    });
  });
  describe('/topics/:slug/articles', () => {
    it('returns error when page query is an invalid input', () => {
      return request
        .get('/api/topics/football/articles?page=one')
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid page number. Page must be queried with a valid number.")
        })
    });
    it('returns error when limit query is an invalid input', () => {
      return request
        .get('/api/topics/football/articles?limit=one')
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid limit. Limit must be queried with a valid number.")
        })
    });
    it('returns error when sort query is an invalid input', () => {
      return request
        .get('/api/topics/football/articles?sort=recent')
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid sort query. Sort must be queried with a valid term; votes, comments, _id.")
        })
    });
    it('returns error when topic slug is an invalid input', () => {
      return request
        .get('/api/topics/gardening/articles')
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid topic slug.")
        })
    });
  });
});