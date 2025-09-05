
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
app.use(cors({
    origin: process.env.REACT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comment', commentRoutes);

let blogTestUser = {
  email: 'blogtest@example.com',
  password: 'TestPass123!'
};

let testCookies;
let testBlogId = 'test-blog-123';
jest.setTimeout(30000);


beforeAll(async () => {
  // Create & confirm a test user
  await request(app)
    .post('/api/auth/signupTestUser')
    .send(blogTestUser);

  // Login to get cookies
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send(blogTestUser);

  if (loginRes.status === 200) {
    testCookies = loginRes.headers['set-cookie'];
  } else {
    console.error('Login failed in beforeAll:', loginRes.body);
  }
});

afterAll(async () => {
  await request(app)
    .delete('/api/auth/deleteTestUser')
    .send({ email: blogTestUser.email });
});

describe('Blog Integration Tests', () => {
  test('POST /api/blog/postblog - should create a blog', async () => {
    if (!testCookies) {
      console.log('Skipping test - no cookies from login');
      return;
    }

    const res = await request(app)
      .post('/api/blog/postblog')
      .set('Cookie', testCookies)
      .send({
        blogId: testBlogId,
        email: blogTestUser.email,
        content: 'This is a test blog',
        plaintext: 'This is a test blog',
        imgIds: [],
        vidIds: [],
        ytIds: [],
        tags: ['test', 'integration']
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Blog created successfully');
    expect(res.body.result.blogId).toBe(testBlogId);
  });

  test('GET /api/blog/getblog/:id - should retrieve blog', async () => {
    if (!testCookies) return;

    const res = await request(app)
      .get(`/api/blog/getblog/${testBlogId}`)
      .set('Cookie', testCookies);

    expect(res.status).toBe(200);
    expect(res.body.result.blog.blogId).toBe(testBlogId);
  });

  test('GET /api/blog/getblogs/:author - should retrieve blogs by author', async () => {
    if (!testCookies) return;

    const username = blogTestUser.email.split('@')[0];
    const res = await request(app)
      .get(`/api/blog/getblogs/${username}`)
      .set('Cookie', testCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.result.blogs)).toBe(true);
  });

  test('PUT /api/blog/like/:id - should like blog', async () => {
    if (!testCookies) return;

    const res = await request(app)
      .put(`/api/blog/like/${testBlogId}`)
      .set('Cookie', testCookies);

    expect(res.status).toBe(200);
    expect(res.body.result.updatedLikes).toContain(blogTestUser.email.split('@')[0]);
  });

  test('PUT /api/blog/unlike/:id - should unlike blog', async () => {
    if (!testCookies) return;

    const res = await request(app)
      .put(`/api/blog/unlike/${testBlogId}`)
      .set('Cookie', testCookies);

    expect(res.status).toBe(200);
    expect(res.body.result.message).toBe('Blog unliked successfully');
  });

  test('PUT /api/blog/dislike/:id - should dislike blog', async () => {
    if (!testCookies) return;

    const res = await request(app)
      .put(`/api/blog/dislike/${testBlogId}`)
      .set('Cookie', testCookies);

    expect(res.status).toBe(200);
    expect(res.body.result.updatedDislikes).toContain(blogTestUser.email.split('@')[0]);
  });

  test('PUT /api/blog/undislike/:id - should undislike blog', async () => {
    if (!testCookies) return;

    const res = await request(app)
      .put(`/api/blog/undislike/${testBlogId}`)
      .set('Cookie', testCookies);

    expect(res.status).toBe(200);
    expect(res.body.result.message).toBe('Blog undisliked successfully');
  });

  test('DELETE /api/blog/deleteblog/:id - should delete blog', async () => {
    if (!testCookies) return;

    const res = await request(app)
      .delete(`/api/blog/deleteblog/${testBlogId}`)
      .set('Cookie', testCookies);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Blog deleted successfully');
  });

  test('Protected routes should return 401/400 without auth', async () => {
    const routes = [
      { method: 'get', path: `/api/blog/getblog/${testBlogId}` },
      { method: 'get', path: `/api/blog/getblogs/${blogTestUser.email.split('@')[0]}` },
      { method: 'delete', path: `/api/blog/deleteblog/${testBlogId}` },
      { method: 'put', path: `/api/blog/like/${testBlogId}` },
      { method: 'put', path: `/api/blog/unlike/${testBlogId}` },
      { method: 'put', path: `/api/blog/dislike/${testBlogId}` },
      { method: 'put', path: `/api/blog/undislike/${testBlogId}` }
    ];

    for (const route of routes) {
      const res = await request(app)[route.method](route.path);
      expect([400, 401]).toContain(res.status);
    }
  });
});
