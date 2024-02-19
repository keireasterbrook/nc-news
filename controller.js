const { selectTopics } = require('./model')

const getTopics = (request, response, next) => {
    return selectTopics()
    .then((topic) => {
        return response.status(200).send({topic})
    })
        .catch((err)=>{
            next(err)})
}



module.exports = { getTopics }