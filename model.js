const db = require('./db/connection')
const fs = require('fs').promises


function selectTopics(){
    return db.query('SELECT * FROM topics;')
    .then((topics) => {
        return topics.rows
    })
}

function selectApi(){
    return fs.readFile(`${__dirname}/endpoints.json`, 'utf-8', (apiName) =>{ 
        JSON.parse(apiName); 
    })
}

function selectArticleById(article_id){
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((article)=>{
        return article.rows;
    })
}

module.exports = { selectTopics, selectApi, selectArticleById }