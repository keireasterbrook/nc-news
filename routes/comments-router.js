const commentsRouter = require('express').Router();
const {deleteComment} = require('../controller')

commentsRouter.route('/:comment_id')
    .delete(deleteComment)


module.exports = commentsRouter;