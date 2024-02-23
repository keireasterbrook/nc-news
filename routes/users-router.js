const usersRouter = require('express').Router()
const {getUsers} = require('../controller')

usersRouter.route('/')
    .get(getUsers)

module.exports = usersRouter;