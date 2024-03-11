const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()) 


const topicsRouter = require('./routes/topics-router')
const commentsRouter = require('./routes/comments-router')
const apiRouter = require('./routes/api-router')
const usersRouter = require('./routes/users-router')
const articlesRouter = require('./routes/articles-router')


app.use('/api/topics', topicsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api', apiRouter)
app.use('/api/users', usersRouter)
app.use('/api/articles', articlesRouter)



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

