const usersRouter = require('express').Router()
const {getUsers, getUserByUsername} = require('../controller')

usersRouter.route('/')
    .get(getUsers)

 usersRouter.route('/:username')
    .get(getUserByUsername)


module.exports = usersRouter;