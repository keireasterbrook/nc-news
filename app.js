const express = require('express');
const app = express();
const { getTopics, getApi, getArticleById, getArticles, getCommentsFromArticle, postComments, patchArticle } = require('./controller')

app.use(express.json())


app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsFromArticle)

app.post('/api/articles/:article_id/comments', postComments)

app.patch('/api/articles/:article_id', patchArticle)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  })
  app.use((err, req, res, next) => {
    if (err.status === 404 || err.code === '23503') {
      res.status(404).send({ msg: 'Not Found' });
    } else next(err);
  })
  app.use((err, req, res, next) => {
    if (err.code === '22P02' || err.name === 'TypeError') {
      res.status(400).send({ msg: 'Bad Request' });
    } else next(err);
  })
  app.use((err, req, res, next) => {
    res.status(500).send('Server Error!');
  })
module.exports = app;

