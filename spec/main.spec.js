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
  describe('/articles', () => {
    describe('/', () => {
      it('returns all articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.equal(2);
          })
      });
    });
    describe('/:article_id', () => {
      it('returns one article by article id', () => {
        let article_id;
        return request
          .get('/api/articles')
          .then(res => {
            return res.body.articles[0]._id
          })
          .then(id => {
            article_id = id;
            return request
              .get(`/api/articles/${id}`)
              .expect(200)
          })
          .then(res => {
            expect(res.body.article_id).to.equal(article_id);
            expect(res.body.article._id).to.equal(article_id);
          })
      });
    });
    describe('/:article_id/comments', () => {
      it('returns all comments for given article id', () => {
        let article_id;
        return request
          .get('/api/articles')
          .then(res => {
            return res.body.articles[0]._id
          })
          .then(id => {
            article_id = id;
            return request
              .get(`/api/articles/${id}/comments`)
              .expect(200)
          })
          .then(res => {
            expect(res.body.article_id).to.equal(article_id);
            expect(res.body.comments.length).to.equal(2);
          })
      });
      it('returns with comment added when new comment added to article', () => {
        let article_id;
        return request
          .get('/api/articles')
          .then(res => {
            return res.body.articles[0]._id
          })
          .then(id => {
            article_id = id;
            return request
              .post(`/api/articles/${id}/comments`)
              .send({ 'comment': 'test comment'})
              .set('Accept', 'application/json')
              .expect(200)
          })
          .then(res => {
            expect(res.body.article_id).to.equal(article_id);
            expect(res.body.comment.body).to.equal('test comment');
          })
      })
    });
  })
});
