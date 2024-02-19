const { selectTopics, selectApi } = require('./model')

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


module.exports = { getTopics, getApi }