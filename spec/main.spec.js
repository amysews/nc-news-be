process.env.NODE_ENV = 'test';
const app = require('../server');
const seedTest = require('../seed/test.seed');
const expect = require('chai').expect;
const request = require('supertest')(app);
const mongoose = require('mongoose');
const config = require('../config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;

describe('/api', () => {
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
  describe('/topics', () => {
    describe('/', () => {
      it('GET returns all topics', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(res => {
            expect(res.body.topics.length).to.equal(3);
          })
      });
    });
    describe('/:slug/articles', () => {
      it('GET returns all articles for a given topic', () => {
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
      it('GET returns all articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.equal(2);
          })
      });
    });
    describe('/:article_id', () => {
      it('GET returns one article by article id', () => {
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
      it('PUT returns with vote increased or descreased based on query for a given article', () => {
        let article_id;
        return request
          .get('/api/articles')
          .then(res => {
            return res.body.articles[0]._id
          })
          .then(id => {
            article_id = id;
            return request
              .put(`/api/articles/${id}?vote=up`)
              .expect(200)
          })
          .then(res => {
            expect(res.body.article.votes).to.equal(1);
          })
      });
    });
    describe('/:article_id/comments', () => {
      it('GET returns all comments for given article id', () => {
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
      it('POST returns with comment added when new comment added to article', () => {
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
              .send({ 'comment': 'test comment' })
              .set('Accept', 'application/json')
              .expect(200)
          })
          .then(res => {
            expect(res.body.article_id).to.equal(article_id);
            expect(res.body.comment.body).to.equal('test comment');
          })
      });
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      it('PUT returns with vote increased or decreased based on query for a given comment', () => {
        let article_id;
        let comment_id;
        return request
          .get('/api/articles')
          .then(res => {
            return res.body.articles[0]._id
          })
          .then(id => {
            article_id = id;
            return request
              .get(`/api/articles/${article_id}/comments`)
              .expect(200)
          })
          .then(res => {
            return res.body.comments[0]._id;
          })
          .then(id => {
            comment_id = id;
            return request
              .put(`/api/comments/${comment_id}?vote=up`)
              .expect(200)
          })
          .then(res => {
            expect(res.body.comment.votes).to.equal(1);
          })
      });
      it('DELETE returns status code of 204 when comment with given comment id deleted', () => {
        let article_id;
        let comment_id;
        return request
          .get('/api/articles')
          .then(res => {
            return res.body.articles[0]._id
          })
          .then(id => {
            article_id = id;
            return request
              .get(`/api/articles/${article_id}/comments`)
              .expect(200)
          })
          .then(res => {
            return res.body.comments[0]._id;
          })
          .then(id => {
            comment_id = id;
            return request
              .delete(`/api/comments/${comment_id}`)
              .expect(204)
          })
      });
    });
  });
  describe('/users', () => {
    describe('/', () => {
      it('GET returns all users', () => {
        return request
          .get('/api/users')
          .expect(200)
          .then(res => {
            expect(res.body.users.length).to.equal(1);
            expect(res.body.users[0].username).to.equal('northcoder');
          });
      });
    });
    describe('/:username', () => {
      it('GET returns user with given username', () => {
        return request
          .get('/api/users/northcoder')
          .expect(200)
          .then(res => {
            expect(res.body.username).to.equal('northcoder');
            expect(res.body.user.username).to.equal('northcoder');
          });
      });
    });
  });
});
