## Northcoders News API

### About

API for [Northcoders News](https://github.com/amysews/FE-FT-NC-News) - built using RESTful principles.

Built using Node.js (v9.2.0), Express.js (v4.14.0), MongoDB (v) and Mongoose (v4.7.0).

The API has been deployed to Heroku and can be accessed [here](#)

### Environment Setup

The following tools are required to run this API locally. Links to guides have been provided to help with installation where required:

* npm - [installation guide](https://www.npmjs.com/get-npm)
* Node.js - [installation guide](https://nodejs.org/en/download/package-manager/)
* git - [installation guide](https://git-scm.com/)
* MongoDB - [installation guide](https://docs.mongodb.com/manual/installation/)

### Project Setup

To run this project locally, clone this repository to your local machine and install the dependencies:
```
git clone https://github.com/amysews/BE-FT-northcoders-news.git
npm install
```
To run MongoDB in your terminal enter the following command in your terminal and keep this window open:
```
~/mongodb/bin/mongod
```
Inside the project folder, you need to first seed the database from the seed file:
```
npm run seed
```
To run the server, enter the following command:
```
npm start
```
The server is setup to run on PORT 3000 (this can be changed in the config.js file) and can be accessed from http://localhost:3000

### Testing

To test the API run the following command:
```
npm test
```
Tests are ran using a separate seed database (this is initialised every time a test is ran).

### API Endpoints
```
GET /api/topics
```
Returns array of topics

```
GET /api/topics/:topic_id/articles
```
Returns array of articles for a given topic.

This endpoint can also be queried by page number, limit of responses and sort method, e.g:
/api/topics/:topic_id/articles?page=1&limit=5&sort=+votes

```
GET /api/articles
```
Returns array of articles

This endpoint can also be queried by page number, limit of responses and sort method, e.g:
/api/articles?page=0&limit=10&sort=-votes

```
GET /api/articles/:article_id
```
Returns one article with that given article id

```
GET /api/articles/:article_id/comments
```
Returns array of comments for a given article id.

This endpoint can also be queried by sort method, e.g:
/api/articles/:article_id/comments?sort=-created_at

```
POST /api/articles/:article_id/comments
```
Add a new comment to an article. This route requires a JSON body with a comment key and value pair
e.g: {"comment": "This is my new comment"}

```
PUT /api/articles/:article_id
```
Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: /api/articles/:article_id?vote=up

```
PUT /api/comments/:comment_id
```
Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: /api/comments/:comment_id?vote=down

```
DELETE /api/comments/:comment_id
```
Deletes a comment

```
GET /api/users
```
Returns array of users

```
GET /api/users/:username
```
Returns profile data for the given user
