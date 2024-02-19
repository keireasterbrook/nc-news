const request = require("supertest");
const app = require('../app');

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

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
            responseArray.forEach((article) => {
                expect(Object.keys(article)).toHaveLength(8)
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('body');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url')
            })
        }) 
    })
        test('should return a different requested article', () => {
            return request(app)
            .get(`/api/articles/5`)
            .expect(200)
            .then((response) => {
                const responseArray = response.body.article
                responseArray.forEach((article) => {
                    expect(Object.keys(article)).toHaveLength(8)
                    expect(article).toHaveProperty('title');
                    expect(article).toHaveProperty('topic');
                    expect(article).toHaveProperty('author');
                    expect(article).toHaveProperty('body');
                    expect(article).toHaveProperty('created_at');
                    expect(article).toHaveProperty('votes');
                    expect(article).toHaveProperty('article_img_url')
                })
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
});



