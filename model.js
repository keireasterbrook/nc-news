const db = require('./db/connection')
const { sort } = require('./db/data/test-data/articles')
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
        return article.rows[0];
    })
}

function selectArticles(sort_by = 'created_at', order = 'DESC'){
    return db.query(`
    SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`)
    .then((articles) => {
        return articles.rows
    })
}

module.exports = { selectTopics, selectApi, selectArticleById, selectArticles }

