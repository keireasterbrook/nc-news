const request = require("supertest");
const app = require('../app');

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { toBeSortedBy } = require('jest-sorted');

const endpoints = require('../endpoints.json')




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
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Not Found");
          })
    });
    test('should return appropriate error if invalid input data type', () => {
        return request(app)
        .get(`/api/articles/TEXT`)
        .expect(400)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Bad Request");
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
        const responseMsg = response.res.statusMessage
        expect(responseMsg).toEqual("Not Found");
      });
})
test('should return in date descending order',() => {
    return request(app)
    .get('/api/articles?sort_by=created_at&order=DESC')
    .expect(200)
    .then((response) => {
        const responseMsg = response.body.article
        expect(responseMsg).toBeSortedBy('created_at', {descending: true})
      });
})
test('should return in date ascending order',() => {
    return request(app)
    .get('/api/articles?sort_by=created_at&order=ASC')
    .expect(200)
    .then((response) => {
        const responseMsg = response.body.article
        expect(responseMsg).toBeSortedBy('created_at', {ascending: true})
      });
})
test('should return in author in descending order',() => {
    return request(app)
    .get('/api/articles?sort_by=author&order=DESC')
    .expect(200)
    .then((response) => {
        const responseMsg = response.body.article
        expect(responseMsg).toBeSortedBy('author', {descending: true})
      });
})
test('should return in author in ascending order, both different from default',() => {
    return request(app)
    .get('/api/articles?sort_by=author&order=ASC')
    .expect(200)
    .then((response) => {
        const responseMsg = response.body.article
        expect(responseMsg).toBeSortedBy('author', {ascending: true})
      });
})

})

describe('GET /api/articles/:article_id/comments', () => {
    test('should return with all comments for an article', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const responseMsg = response.body.comments
            expect(responseMsg.length).toBeGreaterThan(0)
            responseMsg.forEach((comment) => {
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
        const responseMsg = response.body.comments
        expect(responseMsg).toBeSortedBy('created_at', {descending: true})
      });
        
    });
    test('should return 404 not found error for non-existent id request ', () => {
        return request(app)
        .get('/api/articles/999999/comments')
        .expect(404)
        .then((response) => {
        const responseMsg = response.res.statusMessage
        expect(responseMsg).toEqual("Not Found");
        });
    });
    test('should return appropriate error if invalid input data type', () => {
        return request(app)
        .get(`/api/articles/TEXT/comments`)
        .expect(400)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Bad Request");
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
    test('should return posted comment and ignore extra key', () => {
        return request(app)
        .post('/api/articles/3/comments').send({username: 'butter_bridge', body: "a good old body of text", unnecessaryKey: "anything"})
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
        
    })
    test('should return 400 error if no username or body key', () => {
        return request(app)
        .post('/api/articles/3/comments').send({body: 'I have no author'})
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({ message: 'Bad Request: Username and Body required' })})
        
        
    });
    test('should return 400 error if invalid input data type', () => {
        return request(app)
        .post(`/api/articles/TEXT/comments`).send({username: 'butter_bridge', body: "a good old body of text"})
        .expect(400)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Bad Request");
        })
    });
    test('should return 404 error if article attempting to post to does not exist', () => {
        return request(app)
        .post('/api/articles/999999/comments').send({username: 'butter_bridge', body: 'here is a body of text how about that'})
        .expect(404)
        .then((response) => {
        const responseMsg = response.res.statusMessage
        expect(responseMsg).toEqual("Not Found")
    })
    }); 
    test('should return 404 error if username does not exist', () => {
        return request(app)
        .post('/api/articles/3/comments').send({username: 'not_a_real_user', body: 'here is a body of text how about that'})
        .expect(404)
        .then((response) => {
        const responseMsg = response.res.statusMessage
        expect(responseMsg).toEqual("Not Found")
    })
    }); 
    
})

describe('PATCH /api/articles/:article_id', () => {
    test('should return article with updated votes added', () => {
        return request(app)
        .patch('/api/articles/1').send({ inc_votes: 30 })
        .expect(200)
        .then((response) => {
            const updatedArticle = response.body.article
           expect(updatedArticle).toMatchObject({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 130,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
          })
        })
    });
    test('should return article with updated votes subtracted', () => {
        return request(app)
        .patch('/api/articles/1').send({ inc_votes: -30 })
        .expect(200)
        .then((response) => {
            const updatedArticle = response.body.article
            expect(updatedArticle).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: expect.any(String),
                votes: 70,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
              })
            
        })
    })
    test('should return 404 if article attempting to post to does not exist', () => {
        return request(app)
        .patch('/api/articles/999999').send({ inc_votes: 30 })
        .expect(404)
        .then((response) => {
        const responseMsg = response.res.statusMessage
        expect(responseMsg).toEqual("Not Found");
        });
    });
    test('should return 400 if votes is an unacceptable data type', () => {
        return request(app)
        .patch('/api/articles/1').send({ inc_votes: 'TEXT' })
        .expect(400)
        .then((response) => {
        const responseMsg = response.res.statusMessage
        expect(responseMsg).toEqual("Bad Request");
        });
    });
    test('should return 400 error if invalid input data type for the article', () => {
        return request(app)
        .patch('/api/articles/TEXT').send({ inc_votes: 30 })
        .expect(400)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Bad Request");
        })
    });


})

describe('DELETE /api/comments/:comment_id', () => {
    test('should return status 204 with no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual('No Content')
        })
    });
    test('should return 400 error if invalid input data type for the comment id', () => {
        return request(app)
        .delete('/api/comments/TEXT')
        .expect(400)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Bad Request");
        })
    });
    test('should return 404 error if comment id does not exist', () => {
        return request(app)
        .delete('/api/comments/999999')
        .expect(404)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Not Found");
        })
    });
    
});

describe('GET /api/users', () => {
    test('should return with the correct properties', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
            const usersArray = response.body.users
            const currentUsersLength = data.userData.length
            expect(usersArray).toHaveLength(currentUsersLength)
            usersArray.forEach((user) => {
                expect(Object.keys(user)).toHaveLength(3)
                expect(user).toHaveProperty('username')
                expect(user).toHaveProperty('name')
                expect(user).toHaveProperty('avatar_url')
            
        })
    })
})
});

describe('GET /api/articles topic query', () => {
    test('should return specified topic from articles', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then((topic) => {
            const topicsArray = topic.body.article
            expect(topicsArray.length).toBeGreaterThan(0)
            topicsArray.forEach((topic) => {
                expect(topic).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: "cats",
                    author: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url:
                    expect.any(String),
                  })

            })

        })
    });
    test('should return all the articles if query is omitted', () => {
        return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then((response) => {
            const responseArray = response.body.article
            const currentArticleLength = data.articleData.length
            expect(responseArray).toHaveLength(currentArticleLength)
    });
    })
    test('should return correct error when invalid data type inputted', () => {
        return request(app)
        .get('/api/4rTic135?t0p1c=d00g5')
        .expect(404)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Not Found");
          });
    });
    test('should return an empty array when the topic asked for exists but has no articles.', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then((topic) => {
            const topicsArray = topic.body.article
            expect(topicsArray).toEqual([])
        })
    });
    test('should return 404 when non existent topic entered', () => {
        return request(app)
        .get('/api/notATopic')
        .expect(404)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Not Found");
          });
        
    });

});

describe('GET /api/users/:username', () => {
    test('should return an object with the correct properties', () => {
        return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then((response) => {
            const responseObj = response.body.user
            expect(responseObj).toMatchObject({
                username: "butter_bridge",
                avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                name: "jonny"
            })
        })
    });
    test('should return an object with the correct datatypes', () => {
        return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then((response) => {
            const responseObj = response.body.user
            expect(responseObj).toMatchObject({
                username: expect.any(String),
                avatar_url: expect.any(String),
                name: expect.any(String)
            })
        })
    });
    test('should return a different object with the correct properties', () => {
        return request(app)
        .get('/api/users/icellusedkars')
        .expect(200)
        .then((response) => {
            const responseObj = response.body.user
            expect(responseObj).toMatchObject({
                username: "icellusedkars",
                avatar_url: expect.any(String),
                name: expect.any(String)
            })
        })
    });
    test('should return correct error when given invalid username', () => {
        return request(app)
        .get('/api/users/NoUserH3r3')
        .expect(404)
        .then((response) => {
        const responseMsg = response.res.statusMessage
        expect(responseMsg).toEqual("Not Found")
    });
});

})

describe('PATCH /api/comments/:comment_id', () => {
    test('should return comment with updated votes added', () => {
        return request(app)
        .patch('/api/comments/1').send({ inc_votes: 30 })
        .expect(200)
        .then((response) => {
            const updatedComment = response.body.comment
           
           expect(updatedComment).toMatchObject({
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 46,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
          })
        })
    });
    test('should return comment with updated votes subtracted', () => {
        return request(app)
        .patch('/api/comments/1').send({ inc_votes: -10 })
        .expect(200)
        .then((response) => {
            const updatedComment = response.body.comment
            expect(updatedComment).toMatchObject({
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 6,
                author: "butter_bridge",
                article_id: 9,
                created_at: expect.any(String),
              })
            
        })
    })
    test('should return 404 if comment attempting to post to does not exist', () => {
        return request(app)
        .patch('/api/comments/999999').send({ inc_votes: 30 })
        .expect(404)
        .then((response) => {
        const responseMsg = response.res.statusMessage
        expect(responseMsg).toEqual("Not Found");
        });
    });
    test('should return 400 if votes is an unacceptable data type', () => {
        return request(app)
        .patch('/api/comments/1').send({ inc_votes: 'TEXT' })
        .expect(400)
        .then((response) => {
        const responseMsg = response.res.statusMessage
        expect(responseMsg).toEqual("Bad Request");
        });
    });
    test('should return 400 error if invalid input data type for the comment', () => {
        return request(app)
        .patch('/api/comments/TEXT').send({ inc_votes: 30 })
        .expect(400)
        .then((response) => {
            const responseMsg = response.res.statusMessage
            expect(responseMsg).toEqual("Bad Request");
        })
    });
});

