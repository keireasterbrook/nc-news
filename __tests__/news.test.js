const request = require("supertest");
const app = require('../app');

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { toBeSortedBy } = require('jest-sorted');

const endpoints = require("../endpoints.json")




beforeEach(() => seed(data));
afterAll(() => db.end());


describe('GET /api/topics', () => {
    test('should return correct status code', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
    });
    test('should return an array of topic objects with correct properties', () => {
        return request(app)
        .get('/api/topics')
        .then((response) => {
            const topicsArray = response.body.topic
            topicsArray.forEach((topic) => {
                expect(Object.keys(topic)).toHaveLength(2)
                expect(topic).toHaveProperty('slug');
                expect(topic).toHaveProperty('description');
            })
        })
    })
    test('should return 404 not found error for non-existent input request',() => {
        return request(app)
        .get('/api/topics/nope')
        .expect(404)
        .then((response) => {
            const responseArray = response.res.statusMessage
            expect(responseArray).toEqual("Not Found");
          });
    })
});

describe('GET /api', () => {
    test('should return information about available endpoints ', () => {
        return request(app)
        .get(`/api`)
        .expect(200)
        .then((response) => {
            const responseJSON = JSON.parse(response.text)
            expect(responseJSON).toEqual(endpoints)
        })
    });
});

describe('GET /api/articles/:article_id', () => {
    test('should return correct status code', () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
    });
     test('should return the requested article', () => {
        return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then((response) => {
            const responseArray = response.body.article
                expect(responseArray.article_id).toBe(1)
                expect(responseArray).toHaveProperty('title');
                expect(responseArray).toHaveProperty('topic');
                expect(responseArray).toHaveProperty('author');
                expect(responseArray).toHaveProperty('body');
                expect(responseArray).toHaveProperty('created_at');
                expect(responseArray).toHaveProperty('votes');
                expect(responseArray).toHaveProperty('article_img_url')
        }) 
    })
        test('should return a different requested article', () => {
            return request(app)
            .get(`/api/articles/5`)
            .expect(200)
            .then((response) => {
                const responseArray = response.body.article
                    expect(responseArray.article_id).toBe(5)
                    expect(responseArray).toHaveProperty('title');
                    expect(responseArray).toHaveProperty('topic');
                    expect(responseArray).toHaveProperty('author');
                    expect(responseArray).toHaveProperty('body');
                    expect(responseArray).toHaveProperty('created_at');
                    expect(responseArray).toHaveProperty('votes');
                    expect(responseArray).toHaveProperty('article_img_url')
            }) 
        
    })
    test('should return appropriate error if id does not exist', () => {
        return request(app)
        .get(`/api/articles/200000`)
        .expect(404)
        .then((response) => {
            const responseArray = response.res.statusMessage
            expect(responseArray).toEqual("Not Found");
          })
    });
    test('should return appropriate error if invalid input data type', () => {
        return request(app)
        .get(`/api/articles/TEXT`)
        .expect(400)
        .then((response) => {
            const responseArray = response.res.statusMessage
            expect(responseArray).toEqual("Bad Request");
          })
    });
});

describe('GET /api/articles', () => {
    test('should return correct properties', () => {
        return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then((response) => {
            const responseArray = response.body.article
            const currentArticleLength = data.articleData.length
            expect(responseArray).toHaveLength(currentArticleLength)
            responseArray.forEach((article) => {
                expect(Object.keys(article)).toHaveLength(8)
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).toHaveProperty('comment_count')
        })
    });
})  
    test('should return correct data types', () => {
    return request(app)
    .get(`/api/articles`)
    .expect(200)
    .then((response) => {
        const responseArray = response.body.article
        const currentArticleLength = data.articleData.length
        expect(responseArray).toHaveLength(currentArticleLength)
        responseArray.forEach((article) => {
            expect(Object.keys(article)).toHaveLength(8)
            expect(typeof article.author).toEqual('string')
            expect(typeof article.title).toEqual('string')
            expect(typeof article.article_id).toEqual('number')
            expect(typeof article.topic).toEqual('string')
            expect(typeof article.created_at).toEqual('string')
            expect(typeof article.votes).toEqual('number')
            expect(typeof article.article_img_url).toEqual('string')
            expect(typeof article.comment_count).toEqual('number')
    })
});
})
    test('should not return the body property', () => {
        return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then((response) => {
            const responseArray = response.body.article
            responseArray.forEach((article) => {
                expect(article).not.toHaveProperty('body')
        })
    });
})
test('should return all the articles', () => {
    return request(app)
    .get(`/api/articles`)
    .expect(200)
    .then((response) => {
        const responseArray = response.body.article
        const currentArticleLength = data.articleData.length
        expect(responseArray).toHaveLength(currentArticleLength)
});
})
test('should return 404 not found error for non-existent input request',() => {
    return request(app)
    .get('/api/artiiicles')
    .expect(404)
    .then((response) => {
        const responseArray = response.res.statusMessage
        expect(responseArray).toEqual("Not Found");
      });
})
test('should return in date descending order',() => {
    return request(app)
    .get('/api/articles?sort_by=created_at')
    .expect(200)
    .then((response) => {
        const responseArray = response.body.article
        expect(responseArray).toBeSortedBy('created_at', {descending: true})
      });
})

})

describe('GET /api/articles/:article_id/comments', () => {
    test('should return with all comments for an article', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const responseArray = response.body.comments
            expect(responseArray.length).toBeGreaterThan(0)
            responseArray.forEach((comment) => {
                expect(comment.article_id).toBe(1)
            })
        })
    });
    test('should return an array of comments with the correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const responseArray = response.body.comments
            expect(responseArray.length).toBeGreaterThan(0)
            responseArray.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id')
                expect(comment).toHaveProperty('votes')
                expect(comment).toHaveProperty('created_at')
                expect(comment).toHaveProperty('author')
                expect(comment).toHaveProperty('body')
                expect(comment).toHaveProperty('article_id')
            })
        })
        
    });
    test('returned array should be in most recent comments first order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
        const responseArray = response.body.comments
        expect(responseArray).toBeSortedBy('created_at', {descending: true})
      });
        
    });
    test('should return 404 not found error for non-existent id request ', () => {
        return request(app)
        .get('/api/articles/999999/comments')
        .expect(404)
        .then((response) => {
        const responseArray = response.res.statusMessage
        expect(responseArray).toEqual("Not Found");
        });
    });
    test('should return appropriate error if invalid input data type', () => {
        return request(app)
        .get(`/api/articles/TEXT/comments`)
        .expect(400)
        .then((response) => {
            const responseArray = response.res.statusMessage
            expect(responseArray).toEqual("Bad Request");
          })
    });

});

describe('POST /api/articles/:article_id/comments', () => {
    test('should return posted comment', () => {
        return request(app)
        .post('/api/articles/3/comments').send({username: 'butter_bridge', body: "a good old body of text"})
        .expect(201)
        .then((response) => {
            const responseComment = response.body.comment
            expect(responseComment).toMatchObject({
                comment_id: expect.any(Number),
                body: "a good old body of text",
                article_id: 3,
                author: "butter_bridge",
                votes: 0,
                created_at: expect.any(String)
            })
        })
        
    });
    test('should return appropriate error if unacceptable request body', () => {
        return request(app)
        .post('/api/articles/3/comments').send({body: 'I am an acceptable body of text shame about the other guy', unacceptableKey: 'I am so unacceptable'})
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({ message: 'Bad Request: Username and Body required' })})
        
        
    });
    test('should return 404 if article attempting to post to does not exist', () => {
        return request(app)
        .post('/api/articles/999999/comments').send({username: 'butter_bridge', body: 'here is a body of text how about that'})
        .expect(404)
        .then((response) => {
        const responseArray = response.res.statusMessage
        expect(responseArray).toEqual("Not Found");
    });
});
})
