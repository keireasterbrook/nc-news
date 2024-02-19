const express = require('express');
const app = express();
const { getTopics } = require('./controller')


app.get('/api/topics', getTopics)

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
      res.status(400).send({ msg: 'Bad request' });
    } else next(err);
  })
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
  })
module.exports = app;

