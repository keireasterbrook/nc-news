const articlesRouter = require('express').Router();
const {getArticleById, getArticles, getCommentsFromArticle, postComments, patchArticle} = require('../controller')

articlesRouter.route('/')
    .get(getArticles);

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(patchArticle);
    
articlesRouter.route('/:article_id/comments')
    .get(getCommentsFromArticle)
    .post(postComments)

module.exports = articlesRouter;