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

module.exports = { selectTopics, selectApi }