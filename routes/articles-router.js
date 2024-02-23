const articlesRouter = require('express').Router();
const {getArticleById, getArticles, getCommentsFromArticle, postComments, patchArticle, postArticle} = require('../controller')

articlesRouter.route('/')
    .get(getArticles)
    .post(postArticle)

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(patchArticle);
    
articlesRouter.route('/:article_id/comments')
    .get(getCommentsFromArticle)
    .post(postComments)

module.exports = articlesRouter;