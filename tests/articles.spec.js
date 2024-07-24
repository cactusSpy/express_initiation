const request = require('supertest');
const { app } = require('../server');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mockingoose = require('mockingoose');
const Article = require('../api/articles/articles.schema');
const User = require('../api/users/users.model');

describe('Articles API', () => {
  let token;
  const USER_ID = 'fake';
  const ADMIN_ID = 'admin';
  const MOCK_USER = { _id: USER_ID, role: 'user' };
  const MOCK_ADMIN = { _id: ADMIN_ID, role: 'admin' };
  const MOCK_ARTICLE = { title: 'Test Article', content: 'Test Content', userId: USER_ID };
  const MOCK_UPDATED_ARTICLE = { title: 'Updated Article', content: 'Updated Content', userId: USER_ID };
  const MOCK_ARTICLES = [
    { title: 'Test Article', content: 'Test Content', userId: USER_ID },
    { title: 'Another Article', content: 'Another Content', userId: USER_ID }
  ];

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_USER, 'findOne');
    mockingoose(Article).toReturn(MOCK_ARTICLES, 'find');
  });

  test('Create Article', async () => {
    const res = await request(app)
      .post('/api/articles')
      .send(MOCK_ARTICLE)
      .set('x-access-token', token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE.title);
  });

  test('Update Article', async () => {
    token = jwt.sign({ userId: ADMIN_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_ADMIN, 'findOne');
    mockingoose(Article).toReturn(MOCK_UPDATED_ARTICLE, 'findOneAndUpdate');

    const res = await request(app)
      .put('/api/articles/1')
      .send(MOCK_UPDATED_ARTICLE)
      .set('x-access-token', token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_UPDATED_ARTICLE.title);
    expect(res.body.content).toBe(MOCK_UPDATED_ARTICLE.content);
  });

  test('Delete Article', async () => {
    token = jwt.sign({ userId: ADMIN_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_ADMIN, 'findOne');
    mockingoose(Article).toReturn(null, 'findOneAndDelete');

    const res = await request(app)
      .delete('/api/articles/1')
      .set('x-access-token', token);
    expect(res.status).toBe(204);

    
    const fetchRes = await request(app).get(`/api/articles/1`);
    expect(fetchRes.status).toBe(404);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});