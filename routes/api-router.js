const apiRouter = require('express').Router();
const { getApi } = require('../controller')

apiRouter.route('/')
 .get(getApi);

module.exports = apiRouter