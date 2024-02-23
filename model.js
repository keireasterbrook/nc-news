const db = require('./db/connection')
const fs = require('fs').promises


function selectTopics(){
    return db.query('SELECT * FROM topics;')
    .then((topics) => {
        return topics.rows
    })
}

function selectApi(){
    return fs.readFile(`${__dirname}/endpoints.json`, 'utf-8').then((apiName) =>{ 
        return JSON.parse(apiName); 
    })
}

function selectArticleById(article_id){
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((article)=>{
        return article.rows[0];
    })
}

function selectArticles(topic, sort_by = 'created_at', order = 'DESC'){
    let sqlString = `
    SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    CAST(COUNT(comments.article_id) AS INT) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `
    const queryVals = []

    if(topic){
        sqlString += `WHERE articles.topic = $1`
        queryVals.push(topic)
    }
    
    sqlString += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
    `


    return db.query(sqlString, queryVals)
    .then((articles) => {
        return articles.rows
    })
}

function selectCommentsFromArticle(article_id){
 return db.query(`
 SELECT 
 comment_id,
 votes,
 created_at,
 author,
 body,
 article_id
 FROM comments
 WHERE article_id = $1
 ORDER BY created_at DESC`, [article_id])
 .then((comments)=>{
    return comments.rows;
})

}

function insertComments(article_id, username, body){

    return db.query(`
        INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3) 
        RETURNING *
    `, [article_id, username, body])
    .then((comment) => {

        return comment.rows[0];
    });
}

function updateArticle(article_id, updatedVotes){
    
    return db.query(
        `UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING *;
        `, [article_id, updatedVotes]
    ).then((result) => {
        return result.rows[0];
    })
}

function removeComment(comment_id){
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `, [comment_id])
    .then((comment) => {
        return comment.rows[0]
    })
}

function selectUsers(){
    return db.query(`
    SELECT * FROM users;`
    ).then((users) => {return users.rows;})
}

function selectUserByUsername(username){
    return db.query(`
    SELECT * FROM users WHERE username = $1;`, [username])
    .then((user) => { 
        return user.rows[0]})
}


module.exports = { selectTopics, selectApi, selectArticleById, selectArticles, selectCommentsFromArticle, insertComments, updateArticle, removeComment, selectUsers, selectUserByUsername }
