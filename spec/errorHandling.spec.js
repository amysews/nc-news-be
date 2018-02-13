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
  describe('GET /articles', () => {
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
  describe('GET /articles/:article_id', () => {
    it('returns error when article id is an invalid input', () => {
      return request
        .get(`/api/articles/123`)
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid article id.")
        })
    });
  });
  describe('GET /articles/:article_id/comments', () => {
    it('returns error when article id is an invalid input', () => {
      return request
        .get(`/api/articles/123/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid article id.")
        })
    });
    it('returns error when sort query is an invalid input', () => {
      let article_id;
      return request
        .get('/api/articles')
        .then(res => {
          return res.body.articles[0]._id
        })
        .then(id => {
          article_id = id;
          return request
            .get(`/api/articles/${id}/comments?sort=recent`)
            .expect(400)
        })
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid sort query. Sort must be queried with a valid term; votes, _id.")
        })
    });
  });
  describe('PUT /articles/:article_id for voting', () => {
    it('returns error when article id is an invalid input', () => {
      return request
        .put(`/api/articles/123?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid article id.")
        })
    });
    it('returns error when vote query is an invalid input', () => {
      let article_id;
      return request
        .get('/api/articles')
        .then(res => {
          return res.body.articles[0]._id
        })
        .then(id => {
          article_id = id;
          return request
            .put(`/api/articles/${id}?vote=upp`)
            .expect(400)
        })
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid vote query. Must be of the form vote=up or vote=down.")
        })
    });
    it('returns error when vote query is an invalid input', () => {
      let article_id;
      return request
        .get('/api/articles')
        .then(res => {
          return res.body.articles[0]._id
        })
        .then(id => {
          article_id = id;
          return request
            .put(`/api/articles/${id}`)
            .expect(400)
        })
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid vote query. Must be of the form vote=up or vote=down.")
        })
    });
  });
  describe('POST /articles/:article_id/comments', () => {
    it('returns error when article id is an invalid input', () => {
      return request
        .post(`/api/articles/123/comments`)
        .send({ 'comment': 'test comment' })
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid article id.")
        })
    });
    it('returns error when no comment body is provided', () => {
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
            .send({ 'comment': '' })
            .set('Accept', 'application/json')
            .expect(400)
        })
        .then(res => {
          expect(res.body.error.message).to.equal("No comment body provided.")
        })
    });
  });
  describe('GET /topics/:slug/articles', () => {
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
  describe('PUT /comments/:comment_id for voting', () => {
    it('returns error when comment id is an invalid input', () => {
      return request
        .put(`/api/comments/123?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid comment id.")
        })
    });
    it('returns error when vote query is an invalid input', () => {
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
            .put(`/api/comments/${comment_id}?vote=upp`)
            .expect(400)
        })
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid vote query. Must be of the form vote=up or vote=down.")
        })
    });
    it('returns error when vote query is an invalid input', () => {
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
            .put(`/api/comments/${comment_id}`)
            .expect(400)
        })
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid vote query. Must be of the form vote=up or vote=down.")
        })
    });
  });
  describe('DELETE /comments/:comment_id', () => {
    it('returns error when comment id is an invalid input', () => {
      return request
        .delete(`/api/comments/123`)
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid comment id.")
        })
    });
  });
  describe('GET /users/:username', () => {
    it('returns error when username is an invalid input', () => {
      return request
        .get('/api/users/amy')
        .expect(400)
        .then(res => {
          expect(res.body.error.message).to.equal("Invalid username.")
        })
    });
  });
});