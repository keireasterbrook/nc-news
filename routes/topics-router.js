const topicsRouter = require('express').Router();
const {getTopics} = require('../controller')

topicsRouter.route('/')
    .get(getTopics)

module.exports = topicsRouter;