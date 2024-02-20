const express = require('express');
const app = express();
const { getTopics, getApi, getArticleById, getArticles, getCommentsFromArticle } = require('./controller')


app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsFromArticle)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  })
  app.use((err, req, res, next) => {
    if (err.status === 404) {
      res.status(404).send({ msg: 'Not Found' });
    } else next(err);
  })
  app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Bad Request' });
    } else next(err);
  })
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
  })
module.exports = app;

