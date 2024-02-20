const { selectTopics, selectApi, selectArticleById, selectArticles } = require('./model')

const getTopics = (request, response, next) => {
    return selectTopics()
    .then((topic) => {
        return response.status(200).send({topic})
    })
        .catch((err)=>{
            next(err)})
}

const getApi = (request, response, next) => {
    return selectApi()
    .then((api) => {
        return response.status(200).send(api)
    })
        .catch((err)=>{
            next(err)})
}

const getArticleById = (request, response, next) => {
    const { article_id } = request.params
    return selectArticleById(article_id)
    .then((article) => {
        if(!article){
            response.status(404).send("Not Found")
        } else {
            response.status(200).send({article})
        }
    }) .catch((err)=>{
        next(err)})

}

const getArticles = (request, response, next) => {
    return selectArticles()
    .then((article) => {
        return response.status(200).send({article})
    })
        .catch((err)=>{
            next(err)})
}

module.exports = { getTopics, getApi, getArticleById, getArticles }