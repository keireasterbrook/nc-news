const { selectTopics, selectApi, selectArticleById, selectArticles, selectCommentsFromArticle, insertComments, updateArticle, removeComment, selectUsers } = require('./model')

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
    const { topic } = request.query

    return selectArticles(topic)
    .then((article) => {
        return response.status(200).send({article})
    })
        .catch((err)=>{
            next(err)})
}

const getCommentsFromArticle = (request, response, next) => {
    const { article_id } = request.params
    selectCommentsFromArticle(article_id)
    .then((comments) => {
        if (comments.length === 0) {
            return response.status(404).send({ message: 'Not Found' });
        }
        response.status(200).send({comments})
    }).catch((error) => {
        next(error)
    })
}

const postComments = (request, response, next) => {
    const { article_id } = request.params;
    const { username, body } = request.body;

    if (!username || !body) {
        return response.status(400).send({ message: 'Bad Request: Username and Body required' });
    }
  
    selectArticleById(article_id)
    .then((article) => {
        if(!article){
            response.status(404).send("Not Found")
        } else {
    return insertComments(article_id, username, body)
    .then((comment) => {
        response.status(201).send({ comment });
    })
}
}).catch((error) => { 
    next(error);
});
}

const patchArticle = (request, response, next) => {
 const  updatedVotes = request.body.inc_votes
 const { article_id } = request.params
 
selectArticleById(article_id)
 .then((article) => {
     if(!article){
         response.status(404).send("Not Found")
 } else {
 updateArticle(article_id, updatedVotes)
 .then((article) => {
   response.status(200).send({article})
 }).catch((error) => {
    next(error);
})
}
}).catch((error) => {
    next(error);
})
}

const deleteComment = (request, response, next) => {
    const { comment_id } = request.params


    return removeComment(comment_id)
    .then((result) => {
        if(result === undefined){
            response.status(404).send('Not Found')
        }
        response.status(204).send({result})
    })
    .catch((error) => {
        next(error);
    })
}

const getUsers = (request, response, next) =>{
    return selectUsers()
    .then((users) => {
        response.status(200).send({users})
    }).catch((error) => { next(error)})
}

module.exports = { getTopics, getApi, getArticleById, getArticles, getCommentsFromArticle, postComments, patchArticle, deleteComment, getUsers }